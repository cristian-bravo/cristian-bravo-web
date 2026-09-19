import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
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

const waitForServer = async (baseURL, child) => {
  const deadline = Date.now() + 12_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error('The fixture server exited before accepting requests.');
    }

    try {
      const response = await fetch(`${baseURL}/`, {
        signal: AbortSignal.timeout(500),
      });
      if (response.ok) return;
    } catch {
      // The standalone server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  throw new Error('The fixture server did not start in time.');
};

const stopServer = async (child) => {
  if (child.exitCode !== null || child.signalCode !== null) return;

  const exited = once(child, 'exit');
  child.kill();
  await Promise.race([
    exited,
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);

  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
};

test(
  'offline endpoints reach controlled success and error paths without SMTP delivery',
  { timeout: 20_000 },
  async () => {
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
        EMAIL_TEST_TRANSPORT: 'stream',
        YUKI_SITE_CHAT_HISTORY_ENABLED: 'false',
        EMAIL_USER: 'mailer-fixture@example.invalid',
        EMAIL_PASS: 'test-only-password',
        EMAIL_TO: 'recipient-fixture@example.invalid',
        SMTP_HOST: '',
        SMTP_PORT: '',
        SMTP_SECURE: '',
      },
      stdio: 'ignore',
    });

    try {
      await waitForServer(baseURL, child);
      const initialHtml = await (await fetch(baseURL)).text();
      assert.match(initialHtml, /data-yuki-history-enabled="false"/);
      assert.match(initialHtml, /<input[^>]*disabled[^>]*data-yuki-consent/);
      assert.match(initialHtml, /El historial todavía no está disponible/);

      const contact = await fetch(`${baseURL}/api/send-contact`, {
        method: 'POST',
        headers: {
          Origin: baseURL,
          'Content-Type': 'application/json',
          'cf-connecting-ip': '198.51.100.91',
        },
        body: JSON.stringify({
          name: 'Fixture contact',
          email: 'reply-simple@example.invalid',
          company: '+593 99 123 4567',
          consultationType: 'Website',
          message: 'Offline success path',
          lang: 'en',
        }),
      });
      const contactBody = await contact.json();
      assert.equal(contact.status, 200);
      assert.deepEqual(contactBody, { success: true });

      // The three commercial entry paths must remain compatible with the real
      // endpoint allowlist in both languages. Transport remains memory-only.
      for (const [lang, consultationTypes] of [
        ['es', ['Crear software', 'Mejorar software', 'Rescatar software']],
        ['en', ['Build software', 'Improve software', 'Recover software']],
      ]) {
        for (const consultationType of consultationTypes) {
          const intent = await fetch(`${baseURL}/api/send-contact`, {
            method: 'POST',
            headers: { Origin: baseURL, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Fixture intent',
              email: 'qa-intent@example.invalid',
              company: '',
              consultationType,
              message: 'Offline intent delivery check',
              lang,
            }),
          });
          assert.equal(intent.status, 200, `${lang}: ${consultationType}`);
          assert.deepEqual(await intent.json(), { success: true });
        }
      }

      const projectForm = new FormData();
      for (const [key, value] of Object.entries({
        fullName: 'Fixture project',
        email: 'reply-project@example.invalid',
        phone: '+593 99 123 4567',
        projectDescription: 'Offline success path',
        lang: 'en',
      })) {
        projectForm.append(key, value);
      }

      const project = await fetch(`${baseURL}/api/send-project`, {
        method: 'POST',
        headers: {
          Origin: baseURL,
          'cf-connecting-ip': '198.51.100.92',
        },
        body: projectForm,
      });
      const projectBody = await project.json();
      assert.equal(project.status, 200);
      assert.deepEqual(projectBody, { success: true });

      const malformed = await fetch(`${baseURL}/api/send-contact`, {
        method: 'POST',
        headers: {
          Origin: baseURL,
          'Content-Type': 'application/json',
          'cf-connecting-ip': '198.51.100.93',
        },
        body: 'null',
      });
      const malformedBody = await malformed.json();
      assert.equal(malformed.status, 400);
      assert.equal(malformedBody.success, false);
    } finally {
      await stopServer(child);
    }
  },
);
