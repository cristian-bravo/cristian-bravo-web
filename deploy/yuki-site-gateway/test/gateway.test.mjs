import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer as createHttpServer, request as httpRequest } from 'node:http';
import { test } from 'node:test';

import {
  GatewayConfigError,
  createGateway,
  createTransportServer,
  loadConfig,
} from '../server.mjs';

const TOKEN = 'a'.repeat(48);
const ORIGIN = 'https://cystems.ec';
const VISITOR_ID = 'site_0123456789abcdef0123456789abcdef';

test('forwards exactly one stateless, tool-free Ollama chat request', async (t) => {
  const fixture = await startFixture();
  t.after(fixture.close);

  const response = await post(fixture.url, {});

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { response: 'Hola desde Yuki.' });
  assert.equal(fixture.upstreamRequests.length, 1);
  const [upstream] = fixture.upstreamRequests;
  assert.equal(upstream.method, 'POST');
  assert.equal(upstream.path, '/api/chat');
  assert.equal(upstream.body.model, 'qwen2.5:0.5b');
  assert.deepEqual(upstream.body.messages.map((message) => message.role), ['system', 'user']);
  assert.equal(upstream.body.messages[1].content, 'Necesito una cotización.');
  assert.equal(upstream.body.stream, false);
  assert.equal(upstream.body.options.num_ctx, 2_048);
  assert.equal(upstream.body.options.num_predict, 192);
  assert.equal('tools' in upstream.body, false);
  assert.equal('remember' in upstream.body, false);
  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('rejects browser-shaped, malformed, and persistence requests before Ollama', async (t) => {
  const fixture = await startFixture();
  t.after(fixture.close);

  const cases = [
    post(fixture.url, {}, { origin: 'https://attacker.invalid' }),
    post(fixture.url, {}, { authorization: undefined }),
    post(fixture.url, {}, { origin: undefined }),
    post(fixture.url, {}, { contentType: 'text/plain' }),
    post(fixture.url, { remember: true }),
    post(fixture.url, { unexpected: true }),
    fetch(`${fixture.url}/v1/site-chat`, { headers: { origin: ORIGIN }, method: 'GET' }),
  ];
  const responses = await Promise.all(cases);

  assert.deepEqual(responses.map((response) => response.status), [403, 401, 403, 415, 400, 400, 405]);
  assert.equal((await responses[4].json()).error.code, 'PERSISTENCE_UNAVAILABLE');
  assert.equal(responses[6].headers.get('allow'), 'POST');
  assert.equal(fixture.upstreamRequests.length, 0);
});

test('enforces the byte limit even when Content-Length is omitted', async (t) => {
  const fixture = await startFixture();
  t.after(fixture.close);

  const result = await chunkedPost(fixture.url, 'x'.repeat(8 * 1024 + 1));

  assert.equal(result.status, 413);
  assert.equal(result.body.error.code, 'REQUEST_TOO_LARGE');
  assert.equal(fixture.upstreamRequests.length, 0);
});

test('limits one visitor and fails closed rather than evicting active keys', async (t) => {
  const fixture = await startFixture({
    YUKI_GATEWAY_MAX_TRACKED_VISITORS: '32',
    YUKI_GATEWAY_VISITOR_RATE_LIMIT_PER_MINUTE: '1',
  });
  t.after(fixture.close);

  const first = await post(fixture.url, {});
  const second = await post(fixture.url, {});

  assert.equal(first.status, 200);
  assert.equal(second.status, 429);
  assert.equal((await second.json()).error.code, 'RATE_LIMITED');
  assert.equal(fixture.upstreamRequests.length, 1);
});

test('caps concurrent model work instead of queuing a second request', async (t) => {
  let releaseUpstream;
  const fixture = await startFixture({
    onUpstream: async () => new Promise((resolve) => {
      releaseUpstream = resolve;
    }),
  });
  t.after(fixture.close);

  const first = post(fixture.url, {});
  await fixture.waitForUpstream();
  const second = await post(fixture.url, { visitorId: 'site_11111111111111111111111111111111' });
  releaseUpstream();
  const firstResponse = await first;

  assert.equal(second.status, 429);
  assert.equal((await second.json()).error.code, 'GATEWAY_BUSY');
  assert.equal(firstResponse.status, 200);
  assert.equal(fixture.upstreamRequests.length, 1);
});

test('does not leak an upstream detail or request content on controlled failure', async (t) => {
  const sentinel = 'private-ollama-detail-never-return-or-log';
  const visitorMessage = 'This message must not reach logs.';
  const fixture = await startFixture({
    onUpstream: async (_request, response) => {
      response.writeHead(500, { 'content-type': 'text/plain' });
      response.end(sentinel);
    },
  });
  t.after(fixture.close);

  const response = await post(fixture.url, { message: visitorMessage });
  const serialized = JSON.stringify(await response.json());

  assert.equal(response.status, 503);
  assert.equal(serialized.includes(sentinel), false);
  assert.equal(JSON.stringify(fixture.logs).includes(sentinel), false);
  assert.equal(JSON.stringify(fixture.logs).includes(visitorMessage), false);
  assert.equal(JSON.stringify(fixture.logs).includes(TOKEN), false);
});

test('aborts an upstream 500 stream that never finishes', async (t) => {
  let resolveUpstreamClose;
  const upstreamClosed = new Promise((resolve) => {
    resolveUpstreamClose = resolve;
  });
  const fixture = await startFixture({
    onUpstream: async (_request, response) => {
      response.once('close', resolveUpstreamClose);
      response.writeHead(500, { 'content-type': 'application/json' });
      response.write('{"private":"stream-that-must-be-cancelled"');
      return { keepOpen: true };
    },
  });
  t.after(fixture.close);

  const result = await post(fixture.url, {});

  assert.equal(result.status, 503);
  await resolvesWithin(upstreamClosed, 1_000);
  assert.equal(fixture.upstreamRequests.length, 1);
});

test('requires mounted TLS paths when production is selected', () => {
  assert.throws(
    () => loadConfig({ ...baseEnvironment(), NODE_ENV: 'production' }),
    GatewayConfigError,
  );
  assert.throws(
    () => loadConfig({
      ...baseEnvironment(),
      NODE_ENV: 'production',
      TLS_CERT_FILE: '/run/secrets/cert.pem',
      TLS_KEY_FILE: '/run/secrets/key.pem',
      YUKI_GATEWAY_ALLOWED_ORIGINS_JSON: '["http://cystems.ec"]',
    }),
    GatewayConfigError,
  );
});

async function startFixture(overrides = {}) {
  const upstreamRequests = [];
  const logs = [];
  let upstreamSeen;
  const upstreamSeenPromise = new Promise((resolve) => {
    upstreamSeen = resolve;
  });
  const upstream = createHttpServer(async (request, response) => {
    const body = await readJson(request);
    upstreamRequests.push({ body, method: request.method, path: new URL(request.url, 'http://fixture.invalid').pathname });
    upstreamSeen();
    if (overrides.onUpstream !== undefined) {
      const result = await overrides.onUpstream(request, response);
      if (result?.keepOpen === true) return;
      if (!response.writableEnded) {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ message: { content: 'Hola desde Yuki.' } }));
      }
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ message: { content: 'Hola desde Yuki.' } }));
  });
  await listen(upstream);
  const upstreamAddress = upstream.address();
  const config = loadConfig({
    ...baseEnvironment(),
    ...overrides,
    OLLAMA_BASE_URL: `http://127.0.0.1:${upstreamAddress.port}`,
  });
  const gateway = createGateway(config, {
    logger: (record) => logs.push(record),
  });
  const server = createTransportServer(config, gateway.handler, { createServer: createHttpServer });
  await listen(server);
  const address = server.address();

  return {
    logs,
    upstreamRequests,
    url: `http://127.0.0.1:${address.port}`,
    async close() {
      await Promise.all([close(server), close(upstream)]);
    },
    async waitForUpstream() {
      await upstreamSeenPromise;
    },
  };
}

function baseEnvironment() {
  return {
    HOST: '127.0.0.1',
    NODE_ENV: 'test',
    OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
    OLLAMA_CHAT_MODEL: 'qwen2.5:0.5b',
    YUKI_GATEWAY_ALLOWED_MODELS_JSON: '["qwen2.5:0.5b"]',
    YUKI_GATEWAY_ALLOWED_ORIGINS_JSON: JSON.stringify([ORIGIN]),
    YUKI_GATEWAY_OLLAMA_ALLOWED_HOSTS_JSON: '["127.0.0.1"]',
    YUKI_GATEWAY_TOKEN: TOKEN,
  };
}

async function post(baseUrl, payload, options = {}) {
  const headers = {
    authorization: `Bearer ${TOKEN}`,
    'content-type': 'application/json',
    origin: ORIGIN,
  };
  if (Object.hasOwn(options, 'authorization')) {
    if (options.authorization === undefined) delete headers.authorization;
    else if (options.authorization !== null) headers.authorization = options.authorization;
  }
  if (Object.hasOwn(options, 'origin')) {
    if (options.origin === undefined) delete headers.origin;
    else if (options.origin !== null) headers.origin = options.origin;
  }
  if (options.contentType !== undefined) headers['content-type'] = options.contentType;
  const body = options.contentType === 'text/plain'
    ? 'not-json'
    : JSON.stringify({
      message: 'Necesito una cotización.',
      remember: false,
      visitorId: VISITOR_ID,
      ...payload,
    });
  return fetch(`${baseUrl}/v1/site-chat`, { body, headers, method: 'POST' });
}

function chunkedPost(baseUrl, body) {
  const target = new URL(`${baseUrl}/v1/site-chat`);
  return new Promise((resolve, reject) => {
    const request = httpRequest(target, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
        'content-type': 'application/json',
        origin: ORIGIN,
        'transfer-encoding': 'chunked',
      },
      method: 'POST',
    }, async (response) => {
      try {
        resolve({ body: JSON.parse((await readBuffer(response)).toString('utf8')), status: response.statusCode });
      } catch (error) {
        reject(error);
      }
    });
    request.once('error', reject);
    request.write(body.slice(0, 4_096));
    request.end(body.slice(4_096));
  });
}

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error === undefined ? resolve() : reject(error)));
}

async function readJson(request) {
  return JSON.parse((await readBuffer(request)).toString('utf8'));
}

async function readBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function resolvesWithin(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out waiting for upstream close')), timeoutMs);
      timeout.unref?.();
    }),
  ]);
}
