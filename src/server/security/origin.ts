const DEFAULT_PRODUCTION_ORIGINS = ['https://cystems.ec', 'https://www.cystems.ec'];

const toOrigin = (value: string): string | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
};

const configuredOrigins = () => {
  const raw = process.env.ALLOWED_ORIGINS;
  const values = raw?.split(',').map((value) => value.trim()).filter(Boolean) ?? DEFAULT_PRODUCTION_ORIGINS;
  return new Set(values.map(toOrigin).filter((value): value is string => value !== null));
};

const isLocalOrigin = (origin: string) => {
  const value = toOrigin(origin);
  if (!value) return false;
  const hostname = new URL(value).hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
};

const errorResponse = () =>
  new Response(JSON.stringify({ success: false, message: 'Origen de solicitud no permitido.' }), {
    status: 403,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });

/**
 * Browser form APIs are same-origin only. Astro's built-in origin check does
 * not cover JSON requests, so this applies the same guarantee consistently.
 */
export const rejectCrossOriginRequest = (request: Request) => {
  const origin = request.headers.get('origin')?.trim();
  const isProduction = import.meta.env?.PROD === true || process.env.NODE_ENV === 'production';

  if (!origin) {
    return isProduction ? errorResponse() : null;
  }

  const normalizedOrigin = toOrigin(origin);
  if (!normalizedOrigin || normalizedOrigin !== origin) {
    return errorResponse();
  }

  const allowed = configuredOrigins();
  if (allowed.has(normalizedOrigin)) return null;

  if (!isProduction && isLocalOrigin(normalizedOrigin)) return null;

  return errorResponse();
};
