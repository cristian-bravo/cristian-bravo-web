import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

// Compile the actual server modules into disposable scratch. No website .env
// files or credentials are read, and every upstream request is an in-memory stub.
const originalDirectory = process.cwd();
const scratch = await mkdtemp(path.join(tmpdir(), 'cystems-yuki-proxy-'));
const moduleRoot = path.join(scratch, 'modules');
for (const relative of ['runtimeEnv.ts', 'yuki/siteChat.ts', 'crm/workspace.ts', 'security/origin.ts', 'security/rateLimit.ts', 'security/requestGuards.ts', 'security/development-request.ts', 'api/yuki-chat.ts']) {
  const sourcePath = relative === 'security/development-request.ts' ? '../src/data/es/development-request.ts' :
    relative === 'api/yuki-chat.ts' ? '../src/pages/api/yuki-chat.ts' : `../src/server/${relative}`;
  const source = await readFile(new URL(sourcePath, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/from ['"]\.\.\/runtimeEnv['"]/gu, "from '../runtimeEnv.mjs'")
    .replace(/from ['"]\.\/requestGuards['"]/gu, "from './requestGuards.mjs'")
    .replace(/from ['"]\.\.\/\.\.\/data['"]/gu, "from './development-request.mjs'")
    .replace(/from ['"]\.\.\/\.\.\/server\/([^'"]+)['"]/gu, (_, module) => `from '../${module}.mjs'`)
    // Astro substitutes this production build constant in the real SSR bundle.
    .replaceAll('import.meta.env.PROD', 'true');
  const destination = path.join(moduleRoot, relative.replace(/\.ts$/u, '.mjs'));
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, compiled);
}
process.chdir(scratch);
const { askYukiSiteChat, getSiteChatCapabilities } = await import(pathToFileURL(path.join(moduleRoot, 'yuki/siteChat.mjs')).href);
const { getCrmWorkspaceUrl } = await import(pathToFileURL(path.join(moduleRoot, 'crm/workspace.mjs')).href);
const { POST } = await import(pathToFileURL(path.join(moduleRoot, 'api/yuki-chat.mjs')).href);
const originalFetch = globalThis.fetch;
const envKeys = ['NODE_ENV', 'ALLOWED_ORIGINS', 'YUKI_SITE_CHAT_ENABLED', 'YUKI_SITE_CHAT_MODE', 'YUKI_SITE_CHAT_HISTORY_ENABLED', 'YUKI_SITE_API_URL', 'YUKI_SITE_API_TOKEN', 'YUKI_SITE_ORIGIN', 'YUKI_SITE_ALLOW_LOOPBACK_HTTP_FOR_TESTS', 'CYSTEMS_CRM_URL', 'CYSTEMS_CRM_ALLOW_LOOPBACK_HTTP_FOR_TESTS'];
const originalValues = new Map(envKeys.map((key) => [key, process.env[key]]));
const input = { message: 'Quiero mejorar mi proyecto', remember: false, visitorId: `site_${'a'.repeat(32)}` };
const dummyToken = 'D'.repeat(43);
const configure = (overrides = {}) => {
  for (const key of envKeys) delete process.env[key];
  Object.assign(process.env, {
    NODE_ENV: 'test', ALLOWED_ORIGINS: 'https://cystems.example.test', YUKI_SITE_CHAT_ENABLED: 'true', YUKI_SITE_CHAT_MODE: 'unified',
    YUKI_SITE_CHAT_HISTORY_ENABLED: 'true', YUKI_SITE_API_URL: 'https://crm.example.test/v1/site-chat',
    YUKI_SITE_API_TOKEN: dummyToken, YUKI_SITE_ORIGIN: 'https://cystems.example.test', ...overrides,
  });
};
const reply = (payload, options = {}) => new Response(JSON.stringify(payload), { headers: { 'content-type': 'application/json' }, ...options });
let nextClient = 1;
const postChat = async (payload, existingCookies = {}) => {
  const writtenCookies = [];
  const response = await POST({
    request: new Request('http://127.0.0.1:4322/api/yuki-chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://cystems.example.test' }, body: JSON.stringify(payload) }),
    clientAddress: `198.51.100.${nextClient++}`,
    cookies: { get: (name) => existingCookies[name] === undefined ? undefined : { value: existingCookies[name] }, set: (name, value, options) => writtenCookies.push({ name, value, options }) },
  });
  return { response, writtenCookies };
};
test.after(async () => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of originalValues) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  process.chdir(originalDirectory);
  await rm(scratch, { recursive: true, force: true });
});

test('unified proxy forwards only scoped public input with server-only token and exact Origin', async () => {
  configure();
  let observed;
  globalThis.fetch = async (url, options) => { observed = { url, options }; return reply({ response: 'Una propuesta clara.' }); };
  assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: true, pending: false, response: 'Una propuesta clara.' });
  assert.equal(observed.url.href, 'https://crm.example.test/v1/site-chat');
  assert.equal(observed.options.redirect, 'error');
  assert.equal(observed.options.headers.Authorization, `Bearer ${dummyToken}`);
  assert.equal(observed.options.headers.Origin, 'https://cystems.example.test');
  assert.deepEqual(JSON.parse(observed.options.body), input);
  assert.equal(observed.options.signal.aborted, true);
  assert.deepEqual(getSiteChatCapabilities(), { enabled: true, historyEnabled: true });
});

test('standalone mode never advertises history or sends consented requests', async () => {
  configure({ YUKI_SITE_CHAT_MODE: 'standalone' });
  let calls = 0;
  globalThis.fetch = async () => { calls++; return reply({ response: 'Stateless reply' }); };
  assert.deepEqual(getSiteChatCapabilities(), { enabled: true, historyEnabled: false });
  assert.deepEqual(await askYukiSiteChat({ ...input, remember: true }), { available: true, ok: false });
  assert.equal(calls, 0);
  assert.equal((await askYukiSiteChat(input)).ok, true);
});

test('history requires explicit unified mode, configured bridge and history capability', () => {
  for (const override of [{ YUKI_SITE_CHAT_ENABLED: 'false' }, { YUKI_SITE_CHAT_HISTORY_ENABLED: 'false' }, { YUKI_SITE_CHAT_MODE: 'standalone' }, { YUKI_SITE_API_TOKEN: '' }, { YUKI_SITE_CHAT_MODE: 'unknown' }]) {
    configure(override);
    assert.equal(getSiteChatCapabilities().historyEnabled, false);
  }
});

test('rejects unsafe upstream configuration before making a request', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return reply({ response: 'unexpected' }); };
  const invalid = [
    { YUKI_SITE_API_URL: 'http://remote.example.test/v1/site-chat' },
    { YUKI_SITE_API_URL: 'https://user:password@crm.example.test/v1/site-chat' },
    { YUKI_SITE_API_URL: 'https://crm.example.test/v1/site-chat?token=wrong' },
    { YUKI_SITE_API_URL: 'https://crm.example.test/v1/site-chat#fragment' },
    { YUKI_SITE_API_URL: 'https://crm.example.test/other-route' },
    { YUKI_SITE_API_TOKEN: 'D'.repeat(513) },
    { YUKI_SITE_ORIGIN: 'https://cystems.example.test/path' },
    { YUKI_SITE_ORIGIN: 'http://remote.example.test' },
  ];
  for (const override of invalid) { configure(override); assert.deepEqual(await askYukiSiteChat(input), { available: false }); }
  assert.equal(calls, 0);
});

test('allows loopback HTTP only with development or explicit test policy', async () => {
  globalThis.fetch = async () => reply({ response: 'Local response' });
  const local = { YUKI_SITE_API_URL: 'http://127.0.0.1:3000/v1/site-chat', YUKI_SITE_ORIGIN: 'http://127.0.0.1:4322' };
  configure(local);
  assert.deepEqual(await askYukiSiteChat(input), { available: false });
  configure({ ...local, YUKI_SITE_ALLOW_LOOPBACK_HTTP_FOR_TESTS: 'true' });
  assert.equal((await askYukiSiteChat(input)).ok, true);
  configure({ ...local, NODE_ENV: 'production', YUKI_SITE_ALLOW_LOOPBACK_HTTP_FOR_TESTS: 'true' });
  assert.deepEqual(await askYukiSiteChat(input), { available: false });
});

test('preserves manual/approval review acknowledgments only for consented unified requests', async () => {
  configure();
  for (const responseMode of ['manual', 'approval']) {
    globalThis.fetch = async () => reply({ status: 'pending_review', responseMode }, { status: 202 });
    assert.deepEqual(await askYukiSiteChat({ ...input, remember: true }), { available: true, ok: true, pending: true });
    assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
  }
  globalThis.fetch = async () => reply({ status: 'pending_review', responseMode: 'automatic' }, { status: 202 });
  assert.deepEqual(await askYukiSiteChat({ ...input, remember: true }), { available: true, ok: false });
});

test('cancels oversized declared response before reading or parsing', async () => {
  configure();
  let cancelled = false;
  globalThis.fetch = async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }), {
    headers: { 'content-type': 'application/json', 'content-length': '65537' },
  });
  assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
  assert.equal(cancelled, true);
});

test('bounds chunked response bytes and cancels the upstream stream', async () => {
  configure();
  let cancelled = false;
  globalThis.fetch = async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(32_768)); controller.enqueue(new Uint8Array(32_769)); },
    cancel() { cancelled = true; },
  }), { headers: { 'content-type': 'application/json' } });
  assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
  assert.equal(cancelled, true);
});

test('the overall deadline aborts a stalled streaming reply and cancels its body', async () => {
  configure();
  const nativeSetTimeout = globalThis.setTimeout;
  let cancelled = false;
  let upstreamSignal;
  globalThis.setTimeout = (callback, milliseconds, ...arguments_) => nativeSetTimeout(callback, milliseconds === 60_000 ? 5 : milliseconds, ...arguments_);
  globalThis.fetch = async (_, options) => {
    upstreamSignal = options.signal;
    return new Response(new ReadableStream({ cancel() { cancelled = true; } }), { headers: { 'content-type': 'application/json' } });
  };
  try {
    assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
    assert.equal(upstreamSignal.aborted, true);
    assert.equal(cancelled, true);
  } finally { globalThis.setTimeout = nativeSetTimeout; }
});

test('the overall deadline also stops a provider that never returns headers', async () => {
  configure();
  const nativeSetTimeout = globalThis.setTimeout;
  let upstreamSignal;
  globalThis.setTimeout = (callback, milliseconds, ...arguments_) => nativeSetTimeout(callback, milliseconds === 60_000 ? 5 : milliseconds, ...arguments_);
  globalThis.fetch = async (_, options) => { upstreamSignal = options.signal; return new Promise(() => {}); };
  try {
    assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
    assert.equal(upstreamSignal.aborted, true);
  } finally { globalThis.setTimeout = nativeSetTimeout; }
});

test('accepts a valid response at the byte limit without trusting Content-Length', async () => {
  configure();
  const text = JSON.stringify({ response: 'Respuesta acotada' });
  const body = text + ' '.repeat(65_536 - Buffer.byteLength(text));
  globalThis.fetch = async () => new Response(body, { headers: { 'content-type': 'application/json', 'content-length': '1' } });
  assert.equal((await askYukiSiteChat(input)).response, 'Respuesta acotada');
});

test('rejects malformed UTF-8, invalid JSON, oversized text and unexpected response shapes', async () => {
  configure();
  for (const body of [new Uint8Array([0xff]), '{', JSON.stringify({ response: 'x'.repeat(12_001) }), JSON.stringify([]), JSON.stringify({ response: '' })]) {
    globalThis.fetch = async () => new Response(body, { headers: { 'content-type': 'application/json' } });
    assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
  }
});

test('unsupported content types, redirects and thrown provider details never reach the browser', async () => {
  configure();
  for (const fetchFixture of [async () => new Response('<html>upstream</html>', { headers: { 'content-type': 'text/html' } }), async () => new Response(null, { status: 302 }), async () => { throw new Error('Private endpoint and token detail'); }]) {
    globalThis.fetch = fetchFixture;
    assert.deepEqual(await askYukiSiteChat(input), { available: true, ok: false });
  }
});

test('public CRM link accepts HTTPS entry paths and contains no auth state', () => {
  configure({ CYSTEMS_CRM_URL: 'https://crm.example.test/login' });
  assert.equal(getCrmWorkspaceUrl(), 'https://crm.example.test/login');
  assert.deepEqual(Object.keys(getSiteChatCapabilities()).sort(), ['enabled', 'historyEnabled']);
});

test('public CRM link fails closed for unsafe URLs', () => {
  for (const url of ['javascript:alert(1)', 'http://remote.example.test/login', 'https://user:pass@crm.example.test/login', 'https://crm.example.test/login?token=wrong', 'https://crm.example.test/login#token', 'https://crm.example.test/login?', 'https://crm.example.test//login', 'https://crm.example.test/%2fapi', 'https://crm.example.test/lo\ngin']) {
    configure({ CYSTEMS_CRM_URL: url });
    assert.equal(getCrmWorkspaceUrl(), null, url);
  }
});

test('public CRM loopback link is development/test-only and omitted when unset', () => {
  configure(); assert.equal(getCrmWorkspaceUrl(), null);
  configure({ CYSTEMS_CRM_URL: 'http://127.0.0.1:3000/login' }); assert.equal(getCrmWorkspaceUrl(), null);
  configure({ CYSTEMS_CRM_URL: 'http://127.0.0.1:3000/login', CYSTEMS_CRM_ALLOW_LOOPBACK_HTTP_FOR_TESTS: 'true' });
  assert.equal(getCrmWorkspaceUrl(), 'http://127.0.0.1:3000/login');
  process.env.NODE_ENV = 'production'; assert.equal(getCrmWorkspaceUrl(), null);
});

test('API rejects unsupported history before issuing persistent cookies or contacting a provider', async () => {
  configure({ YUKI_SITE_CHAT_MODE: 'standalone' });
  let calls = 0;
  globalThis.fetch = async () => { calls++; return reply({ response: 'unexpected' }); };
  const { response, writtenCookies } = await postChat({ message: input.message, remember: true });
  assert.equal(response.status, 409);
  assert.equal((await response.json()).code, 'HISTORY_UNAVAILABLE');
  assert.deepEqual(writtenCookies, []);
  assert.equal(calls, 0);
});

test('API gives a consented review acknowledgment without forwarding private response metadata', async () => {
  configure();
  globalThis.fetch = async () => reply({ status: 'pending_review', responseMode: 'manual', ownerId: 'private-owner', projectId: 'private-project' }, { status: 202 });
  const { response, writtenCookies } = await postChat({ message: input.message, remember: true });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { success: true, status: 'pending_review' });
  assert.equal(writtenCookies.length, 2);
  for (const cookie of writtenCookies) { assert.equal(cookie.options.maxAge, 2_592_000); assert.equal(cookie.options.httpOnly, true); assert.equal(cookie.options.sameSite, 'strict'); assert.equal(cookie.options.secure, true); }
});

test('revoking consent rotates the visitor and replaces persistent cookies with session cookies', async () => {
  configure();
  let observed;
  globalThis.fetch = async (_, options) => { observed = JSON.parse(options.body); return reply({ response: 'Sin historial nuevo.' }); };
  const oldVisitor = `site_${'b'.repeat(32)}`;
  const { response, writtenCookies } = await postChat({ message: input.message, remember: false }, { cystems_yuki_session: oldVisitor, cystems_yuki_memory_state: 'granted' });
  assert.equal(response.status, 200);
  assert.notEqual(observed.visitorId, oldVisitor);
  assert.equal(observed.remember, false);
  assert.match(observed.visitorId, /^site_[a-f0-9]{32}$/u);
  for (const cookie of writtenCookies) assert.equal(cookie.options.maxAge, undefined);
  assert.equal(writtenCookies.find((cookie) => cookie.name === 'cystems_yuki_memory_state').value, 'ephemeral');
});

test('development loopback permits a real local session while HTTPS/production cookies stay Secure', async () => {
  configure({ NODE_ENV: 'development' });
  globalThis.fetch = async () => reply({ response: 'Local reply' });
  const local = await postChat({ message: input.message, remember: true });
  assert.equal(local.response.status, 200);
  for (const cookie of local.writtenCookies) assert.equal(cookie.options.secure, false);
  configure({ NODE_ENV: 'production' });
  const production = await postChat({ message: input.message, remember: true });
  for (const cookie of production.writtenCookies) assert.equal(cookie.options.secure, true);
});
