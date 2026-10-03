import { getRuntimeEnv, getTrimmedRuntimeEnv } from '../runtimeEnv';

interface SiteChatInput {
  message: string;
  remember: boolean;
  visitorId: string;
}

interface SiteChatConfig {
  endpoint: URL;
  historyEnabled: boolean;
  mode: 'standalone' | 'unified';
  origin: string;
  token: string;
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const MAX_UPSTREAM_BYTES = 64 * 1024;
// A cold local model can take more than 20 seconds. Keep this below the UI's
// 65-second deadline so the proxy can return a useful error before it expires.
const UPSTREAM_TIMEOUT_MS = 60_000;
const TOKEN_PATTERN = /^[A-Za-z0-9._~+/=-]{43,512}$/u;

const allowsLoopbackHttp = () =>
  getRuntimeEnv('NODE_ENV') === 'development' ||
  (getRuntimeEnv('NODE_ENV') === 'test' && getRuntimeEnv('YUKI_SITE_ALLOW_LOOPBACK_HTTP_FOR_TESTS') === 'true');

const getConfig = (): SiteChatConfig | null => {
  // getRuntimeEnv loads .env/.env.local independently of the mail service,
  // while externally injected production values always take precedence.
  if (getRuntimeEnv('YUKI_SITE_CHAT_ENABLED') !== 'true') return null;

  const rawEndpoint = getTrimmedRuntimeEnv('YUKI_SITE_API_URL');
  const token = getTrimmedRuntimeEnv('YUKI_SITE_API_TOKEN');
  const origin = getTrimmedRuntimeEnv('YUKI_SITE_ORIGIN') || 'https://cystems.ec';
  const mode = getTrimmedRuntimeEnv('YUKI_SITE_CHAT_MODE') || 'standalone';

  // Yuki enforces a 32-byte (43+ character URL-safe Base64) credential too.
  if (!rawEndpoint || rawEndpoint.length > 2048 || !token || !TOKEN_PATTERN.test(token)) return null;
  if (mode !== 'standalone' && mode !== 'unified') return null;

  try {
    const endpoint = new URL(rawEndpoint);
    const configuredOrigin = new URL(origin);
    const isLocalHttp =
      endpoint.protocol === 'http:' &&
      LOCAL_HOSTS.has(endpoint.hostname) &&
      allowsLoopbackHttp();
    const isLocalOrigin = configuredOrigin.protocol === 'http:' && LOCAL_HOSTS.has(configuredOrigin.hostname) && allowsLoopbackHttp();

    if (
      /[\\?#\u0000-\u0020\u007f]/u.test(rawEndpoint) ||
      /[\\?#\u0000-\u0020\u007f]/u.test(origin) ||
      (endpoint.protocol !== 'https:' && !isLocalHttp) ||
      endpoint.username ||
      endpoint.password ||
      endpoint.search ||
      endpoint.hash ||
      endpoint.pathname !== '/v1/site-chat' ||
      (configuredOrigin.protocol !== 'https:' && !isLocalOrigin) ||
      configuredOrigin.username ||
      configuredOrigin.password ||
      configuredOrigin.pathname !== '/' ||
      configuredOrigin.search ||
      configuredOrigin.hash
    ) {
      return null;
    }

    return {
      endpoint,
      historyEnabled: mode === 'unified' && getRuntimeEnv('YUKI_SITE_CHAT_HISTORY_ENABLED') === 'true',
      mode,
      origin: configuredOrigin.origin,
      token,
    };
  } catch {
    return null;
  }
};

/** Public presentation capabilities only; never return the upstream URL or token. */
export const getSiteChatCapabilities = () => {
  const config = getConfig();
  return { enabled: config !== null, historyEnabled: config?.historyEnabled ?? false };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const extractResponse = (value: unknown) => {
  if (!isRecord(value)) return null;
  const response = value.response;
  return typeof response === 'string' && response.trim().length > 0 && response.length <= 12_000
    ? response.trim()
    : null;
};

const withAbort = async <T>(operation: Promise<T>, signal: AbortSignal): Promise<T> => {
  if (signal.aborted) throw new Error('Site chat request expired');
  let abort: (() => void) | undefined;
  const expiration = new Promise<never>((_, reject) => {
    abort = () => reject(new Error('Site chat request expired'));
    signal.addEventListener('abort', abort, { once: true });
  });
  try {
    return await Promise.race([operation, expiration]);
  } finally {
    if (abort) signal.removeEventListener('abort', abort);
  }
};

/** Bound wire bytes before decoding or JSON.parse, including chunked replies. */
const readUpstreamJson = async (response: Response, signal: AbortSignal): Promise<unknown> => {
  if (!/^application\/json(?:\s*;|$)/iu.test(response.headers.get('content-type') ?? '')) return null;
  const declaredLength = response.headers.get('content-length');
  if (declaredLength !== null && (!/^\d+$/u.test(declaredLength) || Number(declaredLength) > MAX_UPSTREAM_BYTES)) return null;
  if (!response.body) return null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  let complete = false;
  try {
    for (;;) {
      const next = await withAbort(reader.read(), signal);
      if (next.done) { complete = true; break; }
      length += next.value.byteLength;
      if (length > MAX_UPSTREAM_BYTES) return null;
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown;
  } catch {
    return null;
  } finally {
    if (!complete) void reader.cancel().catch(() => {});
    try { reader.releaseLock(); } catch { /* An aborted pending read will release with cancellation. */ }
  }
};

/**
 * Server-only bridge to the isolated public gateway or unified CRM. The browser
 * never receives the Yuki service URL or its bearer credential.
 */
export const askYukiSiteChat = async (input: SiteChatInput) => {
  const config = getConfig();
  if (!config) return { available: false as const };
  if (input.remember && !config.historyEnabled) return { available: true as const, ok: false as const };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let response: Response | undefined;
  try {
    response = await withAbort(fetch(config.endpoint, {
      method: 'POST',
      redirect: 'error',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        Origin: config.origin,
      },
      body: JSON.stringify({
        message: input.message,
        remember: input.remember,
        visitorId: input.visitorId,
      }),
    }), controller.signal);

    if (response.status !== 200 && response.status !== 202) return { available: true as const, ok: false as const };
    const payload = await readUpstreamJson(response, controller.signal);
    if (
      config.mode === 'unified' && input.remember && response.status === 202 && isRecord(payload) &&
      payload.status === 'pending_review' && (payload.responseMode === 'manual' || payload.responseMode === 'approval')
    ) return { available: true as const, ok: true as const, pending: true as const };
    const answer = response.status === 200 ? extractResponse(payload) : null;

    return answer
      ? { available: true as const, ok: true as const, pending: false as const, response: answer }
      : { available: true as const, ok: false as const };
  } catch {
    return { available: true as const, ok: false as const };
  } finally {
    clearTimeout(timeout);
    controller.abort();
    if (response?.body && !response.body.locked) void response.body.cancel().catch(() => {});
  }
};
