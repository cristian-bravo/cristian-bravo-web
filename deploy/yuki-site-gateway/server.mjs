import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

import { PUBLIC_YUKI_SYSTEM_PROMPT } from './public-persona.mjs';

const DEFAULTS = Object.freeze({
  globalRateLimitPerMinute: 24,
  maximumConcurrent: 1,
  maximumMessageCharacters: 1_200,
  maximumRequestBytes: 8 * 1024,
  maximumResponseCharacters: 1_800,
  maximumTrackedVisitors: 2_048,
  maximumUpstreamResponseBytes: 64 * 1024,
  maximumPredictTokens: 192,
  timeoutMs: 18_000,
  visitorRateLimitPerMinute: 4,
});

const visitorIdPattern = /^site_[a-f0-9]{32}$/u;
const modelNamePattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const tokenPattern = /^Bearer ([^\s]{43,512})$/u;
const forbiddenControlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u;
const jsonContentTypePattern = /^application\/json(?:\s*;|$)/iu;
const OLLAMA_CONTEXT_TOKENS = 2_048;

export class GatewayConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GatewayConfigError';
  }
}

/**
 * Parse only the configuration necessary for the public, stateless sidecar.
 * No Yuki-agent, database, Redis, browser, channel, or owner configuration is
 * accepted here on purpose.
 */
export function loadConfig(environment = process.env) {
  const nodeEnv = parseNodeEnvironment(environment.NODE_ENV);
  const allowedOrigins = parseExactOrigins(
    requireValue(environment, 'YUKI_GATEWAY_ALLOWED_ORIGINS_JSON'),
    'YUKI_GATEWAY_ALLOWED_ORIGINS_JSON',
    { maximum: 16, minimum: 1 },
  );
  const allowedModels = parseStringArray(
    requireValue(environment, 'YUKI_GATEWAY_ALLOWED_MODELS_JSON'),
    'YUKI_GATEWAY_ALLOWED_MODELS_JSON',
    { maximum: 16, minimum: 1, transform: parseModelName },
  );
  const allowedOllamaHosts = parseStringArray(
    environment.YUKI_GATEWAY_OLLAMA_ALLOWED_HOSTS_JSON ?? '["ollama"]',
    'YUKI_GATEWAY_OLLAMA_ALLOWED_HOSTS_JSON',
    { maximum: 16, minimum: 1, transform: parseHostname },
  );
  const ollamaChatModel = parseModelName(
    requireValue(environment, 'OLLAMA_CHAT_MODEL'),
    'OLLAMA_CHAT_MODEL',
  );
  if (!allowedModels.includes(ollamaChatModel)) {
    throw new GatewayConfigError('OLLAMA_CHAT_MODEL must be in YUKI_GATEWAY_ALLOWED_MODELS_JSON');
  }

  const config = {
    allowedOrigins: new Set(allowedOrigins),
    allowedOllamaHosts: new Set(allowedOllamaHosts),
    gatewayToken: parseToken(
      requireValue(environment, 'YUKI_GATEWAY_TOKEN'),
      'YUKI_GATEWAY_TOKEN',
    ),
    globalRateLimitPerMinute: parseInteger(
      environment.YUKI_GATEWAY_GLOBAL_RATE_LIMIT_PER_MINUTE,
      'YUKI_GATEWAY_GLOBAL_RATE_LIMIT_PER_MINUTE',
      DEFAULTS.globalRateLimitPerMinute,
      1,
      1_000,
    ),
    host: parseHost(environment.HOST ?? '0.0.0.0'),
    maximumConcurrent: parseInteger(
      environment.YUKI_GATEWAY_MAX_CONCURRENT,
      'YUKI_GATEWAY_MAX_CONCURRENT',
      DEFAULTS.maximumConcurrent,
      1,
      2,
    ),
    maximumMessageCharacters: parseInteger(
      environment.YUKI_GATEWAY_MAX_MESSAGE_CHARS,
      'YUKI_GATEWAY_MAX_MESSAGE_CHARS',
      DEFAULTS.maximumMessageCharacters,
      100,
      DEFAULTS.maximumMessageCharacters,
    ),
    maximumRequestBytes: parseInteger(
      environment.YUKI_GATEWAY_MAX_REQUEST_BYTES,
      'YUKI_GATEWAY_MAX_REQUEST_BYTES',
      DEFAULTS.maximumRequestBytes,
      1_024,
      32 * 1024,
    ),
    maximumResponseCharacters: parseInteger(
      environment.YUKI_GATEWAY_MAX_RESPONSE_CHARS,
      'YUKI_GATEWAY_MAX_RESPONSE_CHARS',
      DEFAULTS.maximumResponseCharacters,
      100,
      2_400,
    ),
    maximumTrackedVisitors: parseInteger(
      environment.YUKI_GATEWAY_MAX_TRACKED_VISITORS,
      'YUKI_GATEWAY_MAX_TRACKED_VISITORS',
      DEFAULTS.maximumTrackedVisitors,
      32,
      20_000,
    ),
    maximumUpstreamResponseBytes: parseInteger(
      environment.YUKI_GATEWAY_MAX_UPSTREAM_RESPONSE_BYTES,
      'YUKI_GATEWAY_MAX_UPSTREAM_RESPONSE_BYTES',
      DEFAULTS.maximumUpstreamResponseBytes,
      4 * 1024,
      128 * 1024,
    ),
    maximumPredictTokens: parseInteger(
      environment.YUKI_GATEWAY_MAX_PREDICT_TOKENS,
      'YUKI_GATEWAY_MAX_PREDICT_TOKENS',
      DEFAULTS.maximumPredictTokens,
      64,
      256,
    ),
    nodeEnv,
    ollamaBaseUrl: parseOllamaBaseUrl(
      requireValue(environment, 'OLLAMA_BASE_URL'),
      allowedOllamaHosts,
    ),
    ollamaChatModel,
    path: parsePath(environment.YUKI_GATEWAY_PATH ?? '/v1/site-chat'),
    port: parseInteger(environment.PORT, 'PORT', 3_443, 1, 65_535),
    timeoutMs: parseInteger(
      environment.YUKI_GATEWAY_TIMEOUT_MS,
      'YUKI_GATEWAY_TIMEOUT_MS',
      DEFAULTS.timeoutMs,
      1_000,
      DEFAULTS.timeoutMs,
    ),
    tlsCertFile: optionalAbsolutePath(environment.TLS_CERT_FILE, 'TLS_CERT_FILE'),
    tlsKeyFile: optionalAbsolutePath(environment.TLS_KEY_FILE, 'TLS_KEY_FILE'),
    visitorRateLimitPerMinute: parseInteger(
      environment.YUKI_GATEWAY_VISITOR_RATE_LIMIT_PER_MINUTE,
      'YUKI_GATEWAY_VISITOR_RATE_LIMIT_PER_MINUTE',
      DEFAULTS.visitorRateLimitPerMinute,
      1,
      100,
    ),
  };

  if (nodeEnv === 'production' && (config.tlsCertFile === undefined || config.tlsKeyFile === undefined)) {
    throw new GatewayConfigError('TLS_CERT_FILE and TLS_KEY_FILE are required in production');
  }
  if (nodeEnv === 'production' && allowedOrigins.some((origin) => new URL(origin).protocol !== 'https:')) {
    throw new GatewayConfigError('Production origins must use HTTPS');
  }

  return Object.freeze(config);
}

/**
 * Create a tiny server-side boundary around exactly one Ollama `/api/chat`
 * request. The input never selects a model, adds a tool, or opens state.
 */
export function createGateway(config, dependencies = {}) {
  const fetchImplementation = dependencies.fetchImplementation ?? globalThis.fetch;
  if (typeof fetchImplementation !== 'function') {
    throw new TypeError('A fetch implementation is required');
  }
  const clock = dependencies.now ?? (() => Date.now());
  const logger = dependencies.logger ?? defaultLogger;
  const rateLimiter = dependencies.rateLimiter ?? new FixedWindowRateLimiter({
    globalLimit: config.globalRateLimitPerMinute,
    keyLimit: config.visitorRateLimitPerMinute,
    maximumKeys: config.maximumTrackedVisitors,
    now: clock,
  });
  let activeRequests = 0;

  const handler = (request, response) => {
    const requestId = randomUUID();
    void handleRequest({
      activeRequests: () => activeRequests,
      config,
      fetchImplementation,
      logger,
      rateLimiter,
      release: () => {
        activeRequests = Math.max(0, activeRequests - 1);
      },
      request,
      requestId,
      response,
      tryAcquire: () => {
        if (activeRequests >= config.maximumConcurrent) return false;
        activeRequests += 1;
        return true;
      },
    }).catch(() => {
      // The handler already turns expected failures into generic JSON. This
      // last resort deliberately does not serialize an exception or request.
      if (!response.headersSent && !response.destroyed) {
        sendError(response, 503, 'SERVICE_UNAVAILABLE', requestId, config.nodeEnv);
      }
      logSafe(logger, { code: 'UNHANDLED_FAILURE', requestId, status: 503 });
    });
  };

  return Object.freeze({ handler });
}

/**
 * Production always creates an HTTPS server from mounted secret files. Tests
 * may inject a native HTTP factory without weakening the production path.
 */
export function createTransportServer(config, handler, options = {}) {
  if (options.createServer !== undefined) return options.createServer(handler);
  if (config.nodeEnv !== 'production') return createHttpServer(handler);

  return createHttpsServer(
    {
      cert: readFileSync(config.tlsCertFile),
      key: readFileSync(config.tlsKeyFile),
      minVersion: 'TLSv1.2',
    },
    handler,
  );
}

export function startGateway(config = loadConfig(), dependencies = {}) {
  const gateway = createGateway(config, dependencies);
  const server = createTransportServer(config, gateway.handler, dependencies);
  server.headersTimeout = Math.min(10_000, config.timeoutMs);
  server.requestTimeout = config.timeoutMs + 2_000;
  server.keepAliveTimeout = 5_000;
  server.maxConnections = 32;
  server.listen(config.port, config.host, () => {
    logSafe(dependencies.logger ?? defaultLogger, {
      code: 'GATEWAY_STARTED',
      requestId: 'startup',
      status: 200,
    });
  });
  return server;
}

async function handleRequest(input) {
  const {
    activeRequests,
    config,
    fetchImplementation,
    logger,
    rateLimiter,
    release,
    request,
    requestId,
    response,
    tryAcquire,
  } = input;
  const requestUrl = parseRequestUrl(request.url);

  if (request.method === 'GET' && requestUrl.pathname === '/health' && requestUrl.search.length === 0) {
    sendJson(response, 200, { status: 'ok' }, config.nodeEnv);
    logSafe(logger, { code: 'HEALTH', requestId, status: 200 });
    return;
  }
  if (request.method === 'GET' && requestUrl.pathname === '/ready' && requestUrl.search.length === 0) {
    sendJson(response, 200, { status: 'ready' }, config.nodeEnv);
    logSafe(logger, { code: 'READY', requestId, status: 200 });
    return;
  }
  if (requestUrl.pathname !== config.path || requestUrl.search.length > 0) {
    sendError(response, 404, 'NOT_FOUND', requestId, config.nodeEnv);
    logSafe(logger, { code: 'NOT_FOUND', requestId, status: 404 });
    return;
  }
  if (request.method !== 'POST') {
    sendError(response, 405, 'METHOD_NOT_ALLOWED', requestId, config.nodeEnv, { allow: 'POST' });
    logSafe(logger, { code: 'METHOD_NOT_ALLOWED', requestId, status: 405 });
    return;
  }
  if (!config.allowedOrigins.has(request.headers.origin ?? '')) {
    sendError(response, 403, 'ORIGIN_NOT_ALLOWED', requestId, config.nodeEnv);
    logSafe(logger, { code: 'ORIGIN_NOT_ALLOWED', requestId, status: 403 });
    return;
  }
  if (!hasExpectedBearer(request.headers.authorization, config.gatewayToken)) {
    sendError(response, 401, 'UNAUTHORIZED', requestId, config.nodeEnv, { 'www-authenticate': 'Bearer' });
    logSafe(logger, { code: 'UNAUTHORIZED', requestId, status: 401 });
    return;
  }
  if (!isJsonContentType(request.headers['content-type']) || !isIdentityEncoding(request.headers['content-encoding'])) {
    sendError(response, 415, 'UNSUPPORTED_MEDIA_TYPE', requestId, config.nodeEnv);
    logSafe(logger, { code: 'UNSUPPORTED_MEDIA_TYPE', requestId, status: 415 });
    return;
  }
  if (!hasValidContentLength(request.headers['content-length'], config.maximumRequestBytes)) {
    sendError(response, 413, 'REQUEST_TOO_LARGE', requestId, config.nodeEnv);
    logSafe(logger, { code: 'REQUEST_TOO_LARGE', requestId, status: 413 });
    return;
  }

  let rawBody;
  try {
    rawBody = await readRequestBody(request, config.maximumRequestBytes);
  } catch {
    sendError(response, 400, 'INVALID_REQUEST', requestId, config.nodeEnv);
    logSafe(logger, { code: 'INVALID_REQUEST', requestId, status: 400 });
    return;
  }
  if (rawBody === null) {
    sendError(response, 413, 'REQUEST_TOO_LARGE', requestId, config.nodeEnv);
    logSafe(logger, { code: 'REQUEST_TOO_LARGE', requestId, status: 413 });
    return;
  }

  const parsed = parseChatPayload(rawBody, config);
  if (!parsed.ok) {
    sendError(response, parsed.status, parsed.code, requestId, config.nodeEnv);
    logSafe(logger, { code: parsed.code, requestId, status: parsed.status });
    return;
  }

  const visitorKey = createHash('sha256').update(parsed.value.visitorId, 'utf8').digest('hex');
  if (!rateLimiter.consume(visitorKey)) {
    sendError(response, 429, 'RATE_LIMITED', requestId, config.nodeEnv, { 'retry-after': '60' });
    logSafe(logger, { code: 'RATE_LIMITED', requestId, status: 429 });
    return;
  }
  if (!tryAcquire()) {
    sendError(response, 429, 'GATEWAY_BUSY', requestId, config.nodeEnv, { 'retry-after': '1' });
    logSafe(logger, { code: 'GATEWAY_BUSY', requestId, status: 429 });
    return;
  }

  const clientAbort = createClientAbortSignal(request, response);
  try {
    const answer = await askOllama({
      config,
      fetchImplementation,
      message: parsed.value.message,
      signal: clientAbort.signal,
    });
    if (response.destroyed) return;
    sendJson(response, 200, { response: answer }, config.nodeEnv);
    logSafe(logger, { code: 'OK', requestId, status: 200 });
  } catch {
    if (!response.destroyed) {
      sendError(response, 503, 'SERVICE_UNAVAILABLE', requestId, config.nodeEnv);
    }
    logSafe(logger, { code: 'SERVICE_UNAVAILABLE', requestId, status: 503 });
  } finally {
    clientAbort.cleanup();
    release();
    // Keep this branch explicit for code review: requests are never queued.
    void activeRequests;
  }
}

async function askOllama({ config, fetchImplementation, message, signal }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  timeout.unref?.();
  const abortFromClient = () => controller.abort();
  signal?.addEventListener('abort', abortFromClient, { once: true });

  try {
    const response = await fetchImplementation(new URL('/api/chat', config.ollamaBaseUrl), {
      body: JSON.stringify({
        messages: [
          { content: PUBLIC_YUKI_SYSTEM_PROMPT, role: 'system' },
          { content: message, role: 'user' },
        ],
        model: config.ollamaChatModel,
        options: {
          num_ctx: OLLAMA_CONTEXT_TOKENS,
          num_predict: config.maximumPredictTokens,
          temperature: 0.2,
        },
        stream: false,
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
      redirect: 'error',
      signal: controller.signal,
    });
    if (!response.ok || !isJsonContentType(response.headers.get('content-type'))) {
      throw new Error('Ollama response is unavailable');
    }
    const body = await readFetchBody(response.body, config.maximumUpstreamResponseBytes);
    const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body));
    const answer = isPlainRecord(value) && isPlainRecord(value.message)
      ? normalizeOutput(value.message.content, config.maximumResponseCharacters)
      : undefined;
    if (answer === undefined) throw new Error('Ollama response is invalid');
    return answer;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromClient);
    // A non-2xx or non-JSON response is intentionally not read. Abort the
    // underlying fetch in every exit path so an upstream that keeps streaming
    // an error body cannot retain a socket or consume the sole model slot.
    controller.abort();
  }
}

function parseChatPayload(rawBody, config) {
  let value;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(rawBody));
  } catch {
    return { code: 'INVALID_REQUEST', ok: false, status: 400 };
  }
  if (!isPlainRecord(value) || !hasOnlyKeys(value, ['message', 'remember', 'visitorId'])) {
    return { code: 'INVALID_REQUEST', ok: false, status: 400 };
  }
  if (value.remember !== false) {
    return { code: 'PERSISTENCE_UNAVAILABLE', ok: false, status: 400 };
  }
  if (typeof value.visitorId !== 'string' || !visitorIdPattern.test(value.visitorId)) {
    return { code: 'INVALID_REQUEST', ok: false, status: 400 };
  }
  const message = normalizeInput(value.message, config.maximumMessageCharacters);
  if (message === undefined) return { code: 'INVALID_REQUEST', ok: false, status: 400 };
  return { ok: true, value: { message, visitorId: value.visitorId } };
}

function normalizeInput(value, maximumCharacters) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.normalize('NFC').replace(/\r\n?/gu, '\n').trim();
  if (!normalized || forbiddenControlPattern.test(normalized)) return undefined;
  return Array.from(normalized).length <= maximumCharacters ? normalized : undefined;
}

function normalizeOutput(value, maximumCharacters) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.normalize('NFC').replace(/\r\n?/gu, '\n').trim();
  if (!normalized || forbiddenControlPattern.test(normalized)) return undefined;
  return Array.from(normalized).slice(0, maximumCharacters).join('');
}

function readRequestBody(request, maximumBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      request.off('aborted', onAborted);
      request.off('data', onData);
      request.off('end', onEnd);
      request.off('error', onError);
      callback(value);
    };
    const onAborted = () => finish(reject, new Error('Request aborted'));
    const onData = (chunk) => {
      const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += value.length;
      if (total > maximumBytes) {
        finish(resolve, null);
        request.resume();
        return;
      }
      chunks.push(value);
    };
    const onEnd = () => finish(resolve, Buffer.concat(chunks, total));
    const onError = () => finish(reject, new Error('Request read failed'));
    request.once('aborted', onAborted);
    request.on('data', onData);
    request.once('end', onEnd);
    request.once('error', onError);
  });
}

async function readFetchBody(stream, maximumBytes) {
  if (stream === null) throw new Error('Empty upstream response');
  const reader = stream.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new Error('Upstream response is too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function createClientAbortSignal(request, response) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const close = () => {
    if (!response.writableEnded) controller.abort();
  };
  request.once('aborted', abort);
  response.once('close', close);
  return {
    cleanup() {
      request.off('aborted', abort);
      response.off('close', close);
    },
    signal: controller.signal,
  };
}

class FixedWindowRateLimiter {
  constructor({ globalLimit, keyLimit, maximumKeys, now }) {
    this.globalLimit = globalLimit;
    this.keyLimit = keyLimit;
    this.maximumKeys = maximumKeys;
    this.now = now;
    this.global = undefined;
    this.keys = new Map();
  }

  consume(key) {
    const startedAt = Math.floor(this.now() / 60_000) * 60_000;
    const global = currentWindow(this.global, startedAt);
    let selected = this.keys.get(key);
    if (selected?.startedAt !== startedAt) selected = undefined;
    if (selected === undefined && this.keys.size >= this.maximumKeys) {
      this.prune(startedAt);
      if (this.keys.size >= this.maximumKeys) return false;
    }
    selected ??= { count: 0, startedAt };
    if (global.count >= this.globalLimit || selected.count >= this.keyLimit) return false;
    global.count += 1;
    selected.count += 1;
    this.global = global;
    this.keys.set(key, selected);
    return true;
  }

  prune(startedAt) {
    for (const [key, value] of this.keys) {
      if (value.startedAt !== startedAt) this.keys.delete(key);
    }
  }
}

function currentWindow(value, startedAt) {
  return value?.startedAt === startedAt ? value : { count: 0, startedAt };
}

function sendJson(response, status, body, nodeEnv, extraHeaders = {}) {
  if (response.destroyed || response.headersSent) return;
  const payload = Buffer.from(JSON.stringify(body), 'utf8');
  response.writeHead(status, {
    ...securityHeaders(nodeEnv),
    ...extraHeaders,
    'cache-control': 'no-store',
    'content-length': String(payload.byteLength),
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(payload);
}

function sendError(response, status, code, requestId, nodeEnv, extraHeaders = {}) {
  sendJson(response, status, {
    error: {
      code,
      message: 'The site assistant is unavailable for this request.',
    },
    requestId,
  }, nodeEnv, extraHeaders);
}

function securityHeaders(nodeEnv) {
  return {
    'content-security-policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    'cross-origin-resource-policy': 'same-site',
    'permissions-policy': 'camera=(), geolocation=(), microphone=()',
    'referrer-policy': 'no-referrer',
    ...(nodeEnv === 'production'
      ? { 'strict-transport-security': 'max-age=31536000' }
      : {}),
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
  };
}

function hasExpectedBearer(header, expected) {
  if (typeof header !== 'string') return false;
  const candidate = tokenPattern.exec(header ?? '')?.[1];
  if (candidate === undefined) return false;
  const candidateDigest = createHash('sha256').update(candidate, 'utf8').digest();
  const expectedDigest = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

function hasValidContentLength(value, maximumBytes) {
  if (value === undefined) return true;
  if (typeof value !== 'string') return false;
  if (!/^(?:0|[1-9]\d*)$/u.test(value)) return false;
  const length = Number(value);
  return Number.isSafeInteger(length) && length <= maximumBytes;
}

function isJsonContentType(value) {
  return typeof value === 'string' && jsonContentTypePattern.test(value);
}

function isIdentityEncoding(value) {
  return value === undefined || (typeof value === 'string' && value.trim().toLowerCase() === 'identity');
}

function isPlainRecord(value) {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
}

function hasOnlyKeys(value, expected) {
  const keys = Object.keys(value);
  return keys.length === expected.length
    && expected.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function parseRequestUrl(value) {
  try {
    return new URL(value ?? '/', 'https://gateway.invalid');
  } catch {
    return new URL('/', 'https://gateway.invalid');
  }
}

function parseNodeEnvironment(value) {
  const candidate = (value ?? 'development').trim();
  if (!['development', 'production', 'test'].includes(candidate)) {
    throw new GatewayConfigError('NODE_ENV must be development, production, or test');
  }
  return candidate;
}

function parseHost(value) {
  const candidate = value.trim();
  if (!candidate || candidate.length > 255 || /[\s\u0000]/u.test(candidate)) {
    throw new GatewayConfigError('HOST is invalid');
  }
  return candidate;
}

function parsePath(value) {
  const candidate = value.trim();
  if (!/^\/[A-Za-z0-9/_-]{1,127}$/u.test(candidate) || candidate.includes('//') || candidate.includes('..')) {
    throw new GatewayConfigError('YUKI_GATEWAY_PATH is invalid');
  }
  return candidate;
}

function parseToken(value, name) {
  const candidate = value.trim();
  if (candidate.length < 43 || candidate.length > 512 || /\s/u.test(candidate)) {
    throw new GatewayConfigError(`${name} must be a non-whitespace token between 43 and 512 characters`);
  }
  return candidate;
}

function parseModelName(value, name = 'model') {
  const candidate = value.trim();
  if (!modelNamePattern.test(candidate)) throw new GatewayConfigError(`${name} is invalid`);
  return candidate;
}

function parseHostname(value, name = 'host') {
  const candidate = value.trim().toLowerCase();
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/u.test(candidate)) {
    throw new GatewayConfigError(`${name} is invalid`);
  }
  return candidate;
}

function parseOllamaBaseUrl(value, allowedHosts) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new GatewayConfigError('OLLAMA_BASE_URL is invalid');
  }
  if (
    !['http:', 'https:'].includes(url.protocol)
    || url.username
    || url.password
    || url.pathname !== '/'
    || url.search
    || url.hash
    || !allowedHosts.includes(url.hostname.toLowerCase())
  ) {
    throw new GatewayConfigError('OLLAMA_BASE_URL is not an allowed Ollama origin');
  }
  return url;
}

function parseExactOrigins(value, name, options) {
  return parseStringArray(value, name, { ...options, transform: parseExactOrigin });
}

function parseExactOrigin(value, name = 'origin') {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new GatewayConfigError(`${name} is invalid`);
  }
  if (
    !['http:', 'https:'].includes(url.protocol)
    || url.username
    || url.password
    || url.pathname !== '/'
    || url.search
    || url.hash
  ) {
    throw new GatewayConfigError(`${name} must be an exact HTTP(S) origin`);
  }
  return url.origin;
}

function parseStringArray(value, name, { maximum, minimum, transform = (item) => item }) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new GatewayConfigError(`${name} must be a JSON array`);
  }
  if (!Array.isArray(parsed) || parsed.length < minimum || parsed.length > maximum) {
    throw new GatewayConfigError(`${name} must contain between ${minimum} and ${maximum} entries`);
  }
  const values = parsed.map((item) => {
    if (typeof item !== 'string') throw new GatewayConfigError(`${name} must contain strings only`);
    return transform(item, name);
  });
  if (new Set(values).size !== values.length) throw new GatewayConfigError(`${name} values must be unique`);
  return values;
}

function parseInteger(value, name, fallback, minimum, maximum) {
  const raw = value === undefined || value === '' ? String(fallback) : value;
  if (!/^(?:0|[1-9]\d*)$/u.test(raw)) throw new GatewayConfigError(`${name} must be an integer`);
  const result = Number(raw);
  if (!Number.isSafeInteger(result) || result < minimum || result > maximum) {
    throw new GatewayConfigError(`${name} must be between ${minimum} and ${maximum}`);
  }
  return result;
}

function optionalAbsolutePath(value, name) {
  if (value === undefined || value.trim() === '') return undefined;
  const candidate = value.trim();
  if (!isAbsolute(candidate)) throw new GatewayConfigError(`${name} must be an absolute path`);
  return candidate;
}

function requireValue(environment, name) {
  const value = environment[name];
  if (typeof value !== 'string' || value.trim() === '') throw new GatewayConfigError(`${name} is required`);
  return value;
}

function defaultLogger(record) {
  process.stdout.write(`${JSON.stringify({
    code: record.code,
    requestId: record.requestId,
    status: record.status,
    timestamp: new Date().toISOString(),
  })}\n`);
}

function logSafe(logger, record) {
  try {
    logger(record);
  } catch {
    // Logging is never allowed to alter request handling.
  }
}

const invokedAsMain = process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsMain) {
  try {
    const server = startGateway();
    let closing = false;
    const shutdown = () => {
      if (closing) return;
      closing = true;
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 5_000).unref();
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch {
    // Do not print configuration contents or file paths from a production boot
    // failure. The orchestrator can inspect its own non-secret health state.
    process.stderr.write('{"code":"GATEWAY_START_FAILED"}\n');
    process.exitCode = 1;
  }
}
