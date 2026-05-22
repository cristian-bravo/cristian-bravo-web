import type { APIContext } from 'astro';
import { developmentRequestApiContent } from '../../data';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const RATE_LIMIT_ERROR = developmentRequestApiContent.rateLimitError;

const requestLog = new Map<string, number[]>();

const normalizeIp = (value: string | null | undefined) => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  const firstValue = trimmed.split(',')[0]?.trim() ?? '';
  if (!firstValue) return '';

  return firstValue.startsWith('::ffff:') ? firstValue.slice(7) : firstValue;
};

const getClientIp = ({ request, clientAddress }: Pick<APIContext, 'request' | 'clientAddress'>) =>
  normalizeIp(request.headers.get('cf-connecting-ip')) ||
  normalizeIp(request.headers.get('x-real-ip')) ||
  normalizeIp(request.headers.get('x-forwarded-for')) ||
  normalizeIp(clientAddress) ||
  'unknown';

export const checkRateLimit = ({ request, clientAddress }: Pick<APIContext, 'request' | 'clientAddress'>) => {
  const ip = getClientIp({ request, clientAddress });
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = requestLog.get(ip)?.filter((timestamp) => timestamp > windowStart) ?? [];

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000));

    requestLog.set(ip, timestamps);

    return new Response(
      JSON.stringify({
        success: false,
        message: RATE_LIMIT_ERROR,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Retry-After': String(retryAfterSeconds),
        },
      }
    );
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  return null;
};
