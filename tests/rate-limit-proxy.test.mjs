import assert from 'node:assert/strict';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import test from 'node:test';

const getFreePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });

const isStopped = (child) => child.exitCode !== null || child.signalCode !== null;

const waitForServer = async (baseURL, child) => {
  const deadline = Date.now() + 12_000;

  while (Date.now() < deadline) {
    if (isStopped(child)) throw new Error('The rate-limit fixture exited before accepting requests.');

    try {
      const response = await fetch(`${baseURL}/`, { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch {
      // The standalone server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  throw new Error('The rate-limit fixture did not start in time.');
};

const stopServer = async (child) => {
  if (isStopped(child)) return;

  const exited = once(child, 'exit');
  child.kill();
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 3_000))]);

  if (!isStopped(child)) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
};

const startFixture = async ({ trustProxy }) => {
  const port = await getFreePort();
  const baseURL = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['./dist/server/entry.mjs'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(port),
      NODE_ENV: 'test',
      ALLOWED_ORIGINS: baseURL,
      EMAIL_USER: '',
      EMAIL_PASS: '',
      TRUST_PROXY: trustProxy ? 'cloudflare' : '',
      TRUSTED_PROXY_CIDRS: trustProxy ? '127.0.0.1/32,::1/128' : '',
    },
    stdio: 'ignore',
  });

  await waitForServer(baseURL, child);
  return { baseURL, child };
};

const sendMalformedContact = (baseURL, claimedIp) =>
  fetch(`${baseURL}/api/send-contact`, {
    method: 'POST',
    headers: {
      Origin: baseURL,
      'Content-Type': 'application/json',
      'cf-connecting-ip': claimedIp,
    },
    body: 'null',
  });

test('forged CF-Connecting-IP is ignored unless the peer proxy is explicitly trusted', { timeout: 30_000 }, async () => {
  const defaultFixture = await startFixture({ trustProxy: false });

  try {
    for (let index = 0; index < 10; index += 1) {
      const response = await sendMalformedContact(defaultFixture.baseURL, `198.51.100.${index + 1}`);
      assert.equal(response.status, 400);
    }

    const limited = await sendMalformedContact(defaultFixture.baseURL, '198.51.100.250');
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get('retry-after')) > 0);
  } finally {
    await stopServer(defaultFixture.child);
  }

  const trustedFixture = await startFixture({ trustProxy: true });

  try {
    for (let index = 0; index < 11; index += 1) {
      const response = await sendMalformedContact(trustedFixture.baseURL, `198.51.101.${index + 1}`);
      assert.equal(response.status, 400);
    }
  } finally {
    await stopServer(trustedFixture.child);
  }
});
