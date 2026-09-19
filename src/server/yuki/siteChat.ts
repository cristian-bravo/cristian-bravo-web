import { getRuntimeEnv, getTrimmedRuntimeEnv } from '../runtimeEnv';

interface SiteChatInput {
  message: string;
  remember: boolean;
  visitorId: string;
}

interface SiteChatConfig {
  endpoint: URL;
  origin: string;
  token: string;
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

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

  // Yuki enforces a 32-byte (43+ character URL-safe Base64) credential too.
  if (!rawEndpoint || !token || token.length < 43) return null;

  try {
    const endpoint = new URL(rawEndpoint);
    const configuredOrigin = new URL(origin);
    const isLocalHttp =
      endpoint.protocol === 'http:' &&
      LOCAL_HOSTS.has(endpoint.hostname) &&
      allowsLoopbackHttp();

    if (
      (endpoint.protocol !== 'https:' && !isLocalHttp) ||
      endpoint.username ||
      endpoint.password ||
      endpoint.search ||
      endpoint.hash ||
      !['http:', 'https:'].includes(configuredOrigin.protocol) ||
      configuredOrigin.username ||
      configuredOrigin.password ||
      configuredOrigin.pathname !== '/' ||
      configuredOrigin.search ||
      configuredOrigin.hash
    ) {
      return null;
    }

    return { endpoint, origin: configuredOrigin.origin, token };
  } catch {
    return null;
  }
};

const extractResponse = (value: unknown) => {
  if (typeof value !== 'object' || value === null || !('response' in value)) return null;
  const response = (value as { response?: unknown }).response;
  return typeof response === 'string' && response.trim().length > 0 && response.length <= 12_000
    ? response.trim()
    : null;
};

/**
 * Server-only bridge to Yuki's dedicated public-site gateway. The browser
 * never receives the Yuki service URL or its bearer credential.
 */
export const askYukiSiteChat = async (input: SiteChatInput) => {
  const config = getConfig();
  if (!config) return { available: false as const };

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(20_000),
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
    });

    if (!response.ok) return { available: true as const, ok: false as const };
    const answer = extractResponse(await response.json().catch(() => null));

    return answer
      ? { available: true as const, ok: true as const, response: answer }
      : { available: true as const, ok: false as const };
  } catch {
    return { available: true as const, ok: false as const };
  }
};
