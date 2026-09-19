import { randomBytes } from 'node:crypto';
import { defineMiddleware } from 'astro:middleware';
import { loadRuntimeEnvFiles } from './server/runtimeEnv';

const buildContentSecurityPolicy = (nonce: string, upgradeInsecureRequests: boolean) =>
  [
    "base-uri 'self'",
    "default-src 'self'",
    "font-src 'self' data: https://fonts.gstatic.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob:",
    "object-src 'none'",
    "script-src 'self' 'nonce-" + nonce + "'",
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    ...(upgradeInsecureRequests ? ['upgrade-insecure-requests'] : []),
  ].join('; ');

const isHtml = (response: Response) =>
  response.headers.get('content-type')?.toLowerCase().includes('text/html') ?? false;

export const onRequest = defineMiddleware(async (context, next) => {
  // Load before origin/proxy checks, not only after the first mail/chat call.
  loadRuntimeEnvFiles();
  const nonce = randomBytes(18).toString('base64');
  context.locals.cspNonce = nonce;

  const response = await next();
  const { headers } = response;
  const isProduction = import.meta.env.PROD;
  // A standalone preview on loopback has no TLS terminator. WebKit upgrades
  // even these URLs, so exempt only exact HTTP loopback hosts, never LAN or
  // public deployment hostnames. Public production still enforces HTTPS.
  const isLocalHttp = context.url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]', '::1'].includes(context.url.hostname);
  const enforceHttps = (isProduction || context.url.protocol === 'https:') && !isLocalHttp;

  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=(), usb=()');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');

  if (enforceHttps) {
    headers.set('Strict-Transport-Security', 'max-age=31536000');
  }

  if (context.url.pathname.startsWith('/api/')) {
    headers.set('Cache-Control', 'no-store');
  }

  if (isHtml(response)) {
    headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce, enforceHttps));
    headers.set('Cache-Control', 'private, no-cache');
  }

  return response;
});
