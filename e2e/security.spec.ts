import { expect, test } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4321'}`;
const trustedOrigin = new URL(baseURL).origin;

// playwright.config.ts explicitly designates the loopback test server as a
// trusted proxy. The independent Node fixture tests the default, untrusted
// behavior so these synthetic client IPs are never mistaken for production.
const trustedFixtureHeaders = (lastOctet: number) => ({
  Origin: trustedOrigin,
  'cf-connecting-ip': `198.51.100.${lastOctet}`,
});

test.describe('API security boundaries', () => {
  test('enforces the byte cap even when Content-Length is absent', async () => {
    const { readBodyWithinLimit } = await import('../src/server/security/requestGuards.ts');
    const request = new Request('http://security-fixture.invalid/contact', {
      method: 'POST',
      body: '0123456789',
    });

    expect(request.headers.get('content-length')).toBeNull();
    await expect(readBodyWithinLimit(request, 8)).resolves.toBeNull();
  });

  test('rejects a cross-origin JSON request before it can reach the mailer', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/send-contact`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.invalid',
      },
      data: JSON.stringify({}),
    });

    expect(response.status()).toBe(403);
    expect(response.headers()['access-control-allow-origin']).toBeUndefined();
  });

  test('requires an exact JSON media type and safe response headers', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/send-contact`, {
      headers: {
        ...trustedFixtureHeaders(11),
        'Content-Type': 'application/jsonp',
      },
      data: '{}',
    });

    expect(response.status()).toBe(415);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()['cache-control']).toContain('no-store');
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('handles null, arrays, unknown properties, CRLF injection, and oversized JSON without a 500', async ({ request }) => {
    const requests = [
      JSON.stringify(null),
      JSON.stringify([]),
      JSON.stringify({ unexpected: 'field' }),
      JSON.stringify({
        name: 'Ada\r\nBcc: injected@example.invalid',
        email: 'ada@example.invalid',
        company: '1234567890',
        consultationType: 'Desarrollo web',
        message: 'Hello',
        lang: 'es',
      }),
    ];

    for (const [index, data] of requests.entries()) {
      const response = await request.post(`${baseURL}/api/send-contact`, {
        headers: {
          ...trustedFixtureHeaders(20 + index),
          'Content-Type': 'application/json',
        },
        data,
      });

      expect(response.status()).toBe(400);
    }

    const oversized = await request.post(`${baseURL}/api/send-contact`, {
      headers: {
        ...trustedFixtureHeaders(30),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ message: 'x'.repeat(25 * 1024) }),
    });

    expect(oversized.status()).toBe(413);
  });

  test('enforces a bounded per-client request rate and returns standard retry metadata', async ({ request }) => {
    const headers = {
      ...trustedFixtureHeaders(40),
      'Content-Type': 'application/json',
    };

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request.post(`${baseURL}/api/send-contact`, {
        headers,
        data: 'null',
      });
      expect(response.status()).toBe(400);
    }

    const limited = await request.post(`${baseURL}/api/send-contact`, {
      headers,
      data: 'null',
    });

    expect(limited.status()).toBe(429);
    expect(Number(limited.headers()['retry-after'])).toBeGreaterThan(0);
    expect(Number(limited.headers()['ratelimit-reset'])).toBeGreaterThan(0);
    expect(limited.headers()['ratelimit-policy']).toContain('10;w=3600');
  });

  test('rejects malformed project payloads and a file whose bytes do not match its claimed PDF type', async ({ request }) => {
    const wrongType = await request.post(`${baseURL}/api/send-project`, {
      headers: {
        ...trustedFixtureHeaders(50),
        'Content-Type': 'application/json',
      },
      data: '{}',
    });

    expect(wrongType.status()).toBe(415);

    const disguisedAttachment = await request.post(`${baseURL}/api/send-project`, {
      headers: trustedFixtureHeaders(51),
      multipart: {
        fullName: 'Security fixture',
        email: 'security-fixture@example.invalid',
        phone: '+593 999 999 999',
        projectDescription: 'This must not trigger an email.',
        lang: 'en',
        attachment: {
          name: 'proposal.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('not a portable document file'),
        },
      },
    });

    expect(disguisedAttachment.status()).toBe(400);
  });
});

test.describe('SMTP safety fixture', () => {
  test.describe.configure({ mode: 'serial' });

  test('uses an in-memory Nodemailer transport and rejects header injection without external delivery', async () => {
    const keys = ['NODE_ENV', 'EMAIL_TEST_TRANSPORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE'] as const;
    const previous = new Map(keys.map((key) => [key, process.env[key]]));

    try {
      Object.assign(process.env, {
        NODE_ENV: 'test',
        EMAIL_TEST_TRANSPORT: 'stream',
        EMAIL_USER: 'mailer-fixture@example.invalid',
        EMAIL_PASS: 'test-only-password',
        EMAIL_TO: 'recipient-fixture@example.invalid',
        SMTP_HOST: '',
        SMTP_PORT: '',
        SMTP_SECURE: '',
      });

      const { sendSimpleEmail, verifySmtpTransport } = await import('../src/server/email/sendEmail.ts');

      // Stream transport has no remote SMTP peer, so Nodemailer reports false
      // instead of opening a network connection.
      await expect(verifySmtpTransport()).resolves.toBe(false);

      const delivery = await sendSimpleEmail({
        from_name: 'Mailer fixture',
        reply_to: 'reply-fixture@example.invalid',
        message: 'A memory-only security test.',
        consultationType: 'Test',
        contact: '0000000000',
      });
      const message = (delivery as { message?: Buffer | string }).message;
      const rawMessage = Buffer.isBuffer(message) ? message.toString('utf8') : String(message ?? '');

      expect(rawMessage).toContain('Nueva consulta desde CYSTEMS');
      expect(rawMessage).toContain('reply-fixture@example.invalid');

      await expect(
        sendSimpleEmail({
          from_name: 'Mailer fixture',
          reply_to: 'reply-fixture@example.invalid\r\nBcc: attacker@example.invalid',
          message: 'This must never be delivered.',
          consultationType: 'Test',
          contact: '0000000000',
        })
      ).rejects.toThrow('INVALID_MAIL_DATA');
    } finally {
      for (const key of keys) {
        const value = previous.get(key);
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    }
  });
});
