import { expect, test } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT || '4321'}`;
const trustedOrigin = new URL(baseURL).origin;
const MAX_BODY_BYTES = 8 * 1024;

const trustedFixtureHeaders = (lastOctet: number, extraHeaders: Record<string, string> = {}) => ({
  Origin: trustedOrigin,
  'Content-Type': 'application/json',
  'cf-connecting-ip': `198.51.102.${lastOctet}`,
  ...extraHeaders,
});

const setCookies = (response: { headersArray: () => Array<{ name: string; value: string }> }) =>
  response.headersArray().filter((header) => header.name.toLowerCase() === 'set-cookie').map((header) => header.value);

const findCookie = (cookies: string[], name: string) => {
  const cookie = cookies.find((value) => value.startsWith(`${name}=`));
  expect(cookie, `Expected ${name} cookie`).toBeTruthy();
  return cookie as string;
};

const readCookieValue = (cookie: string, name: string) => {
  const match = cookie.match(new RegExp(`^${name}=([^;]+)`));
  expect(match, `Expected ${name} value`).toBeTruthy();
  return match?.[1] ?? '';
};

const expectCookieSecurity = (cookie: string, persistent: boolean) => {
  expect(cookie).toContain('Path=/');
  expect(cookie).toMatch(/HttpOnly/i);
  expect(cookie).toMatch(/SameSite=Strict/i);
  expect(cookie).toMatch(/Secure/i);

  if (persistent) {
    expect(cookie).toMatch(/Max-Age=2592000/i);
  } else {
    expect(cookie).not.toMatch(/Max-Age=/i);
  }
};

test.describe('Yuki proxy security boundaries', () => {
  test('rejects a foreign Origin', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.invalid',
      },
      data: JSON.stringify({ message: 'test', remember: false }),
    });

    expect(response.status()).toBe(403);
    expect(response.headers()['access-control-allow-origin']).toBeUndefined();
  });

  test('rejects a missing Origin in the production fixture', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: {
        'Content-Type': 'application/json',
        'cf-connecting-ip': '198.51.102.2',
      },
      data: JSON.stringify({ message: 'test', remember: false }),
    });

    expect(response.status()).toBe(403);
  });

  test('accepts only POST with application/json', async ({ request }) => {
    const methodResponse = await request.get(`${baseURL}/api/yuki-chat`, {
      headers: { Origin: trustedOrigin },
    });
    expect(methodResponse.status()).toBe(405);
    expect(methodResponse.headers().allow).toBe('POST');

    const contentTypeResponse = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: {
        Origin: trustedOrigin,
        'Content-Type': 'text/plain',
      },
      data: 'not-json',
    });
    expect(contentTypeResponse.status()).toBe(415);
  });

  test('rejects non-object payloads, extra keys, and a non-boolean remember flag', async ({ request }) => {
    const payloads = [
      'null',
      '[]',
      JSON.stringify({ message: 'test', remember: false, extra: 'not-allowed' }),
      JSON.stringify({ message: 'test', remember: 'true' }),
    ];

    for (const [index, payload] of payloads.entries()) {
      const response = await request.post(`${baseURL}/api/yuki-chat`, {
        headers: trustedFixtureHeaders(10 + index),
        data: payload,
      });
      expect(response.status()).toBe(400);
    }
  });

  test('rejects control characters and messages over 1,200 characters', async ({ request }) => {
    const controlCharacter = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(20),
      data: JSON.stringify({ message: 'hello\u0000yuki', remember: false }),
    });
    expect(controlCharacter.status()).toBe(400);

    const tooLong = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(21),
      data: JSON.stringify({ message: 'x'.repeat(1_201), remember: false }),
    });
    expect(tooLong.status()).toBe(400);
  });

  test('enforces the 8 KiB cap when Content-Length is absent and when it is declared', async ({ request }) => {
    const { readBodyWithinLimit } = await import('../src/server/security/requestGuards.ts');
    const chunkedRequest = new Request('http://security-fixture.invalid/yuki', {
      method: 'POST',
      body: 'x'.repeat(MAX_BODY_BYTES + 1),
    });

    expect(chunkedRequest.headers.get('content-length')).toBeNull();
    await expect(readBodyWithinLimit(chunkedRequest, MAX_BODY_BYTES)).resolves.toBeNull();

    const oversized = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(30),
      data: JSON.stringify({ message: 'x'.repeat(MAX_BODY_BYTES), remember: false }),
    });
    expect(oversized.status()).toBe(413);
  });

  test('returns a controlled 503 with no service secret or storage claim while Yuki is disabled', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(40),
      data: JSON.stringify({ message: 'Availability probe', remember: false }),
    });
    const body = await response.json();
    const serialized = JSON.stringify(body).toLowerCase();

    expect(response.status()).toBe(503);
    expect(body).toMatchObject({ success: false, code: 'YUKI_UNAVAILABLE' });
    expect(body).not.toHaveProperty('visitorId');
    expect(body).not.toHaveProperty('remember');
    expect(serialized).not.toMatch(/bearer|token|api[_-]?key|https?:\/\//);
  });

  test('uses secure persistent cookies only after opt-in, then revokes by rotating to session state', async ({ request }) => {
    const optIn = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(50),
      data: JSON.stringify({ message: 'Remember this consent test', remember: true }),
    });
    expect(optIn.status()).toBe(503);

    const optInCookies = setCookies(optIn);
    const persistentVisitorCookie = findCookie(optInCookies, 'cystems_yuki_session');
    const persistentMemoryCookie = findCookie(optInCookies, 'cystems_yuki_memory_state');
    const oldVisitorId = readCookieValue(persistentVisitorCookie, 'cystems_yuki_session');

    expect(oldVisitorId).toMatch(/^site_[a-f0-9]{32}$/);
    expect(persistentMemoryCookie).toMatch(/^cystems_yuki_memory_state=granted(?:;|$)/);
    expectCookieSecurity(persistentVisitorCookie, true);
    expectCookieSecurity(persistentMemoryCookie, true);

    const revocation = await request.post(`${baseURL}/api/yuki-chat`, {
      headers: trustedFixtureHeaders(51, {
        Cookie: `cystems_yuki_session=${oldVisitorId}; cystems_yuki_memory_state=granted`,
      }),
      data: JSON.stringify({ message: 'Revoke remembered context', remember: false }),
    });
    expect(revocation.status()).toBe(503);

    const revocationCookies = setCookies(revocation);
    const ephemeralVisitorCookie = findCookie(revocationCookies, 'cystems_yuki_session');
    const ephemeralMemoryCookie = findCookie(revocationCookies, 'cystems_yuki_memory_state');
    const newVisitorId = readCookieValue(ephemeralVisitorCookie, 'cystems_yuki_session');

    expect(newVisitorId).toMatch(/^site_[a-f0-9]{32}$/);
    expect(newVisitorId).not.toBe(oldVisitorId);
    expect(ephemeralMemoryCookie).toMatch(/^cystems_yuki_memory_state=ephemeral(?:;|$)/);
    expectCookieSecurity(ephemeralVisitorCookie, false);
    expectCookieSecurity(ephemeralMemoryCookie, false);
  });
});
