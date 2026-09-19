import type { APIContext } from 'astro';
import { isIP } from 'node:net';
import { developmentRequestApiContent } from '../../data';
import { jsonResponse } from './requestGuards';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_TRACKED_CLIENTS = 5_000;
const MAINTENANCE_INTERVAL_MS = 60 * 1000;
const RATE_LIMIT_ERROR = developmentRequestApiContent.rateLimitError;

// Keep synchronized with https://www.cloudflare.com/ips-v4/ and /ips-v6/.
// Verified 2026-09-19 against https://www.cloudflare.com/ips-v4 and
// https://www.cloudflare.com/ips-v6. Recheck these when proxy topology changes.
const CLOUDFLARE_PROXY_CIDRS = [
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '108.162.192.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '198.41.128.0/17',
  '162.158.0.0/15',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '172.64.0.0/13',
  '131.0.72.0/22',
  '2400:cb00::/32',
  '2606:4700::/32',
  '2803:f800::/32',
  '2405:b500::/32',
  '2405:8100::/32',
  '2a06:98c0::/29',
  '2c0f:f248::/32',
] as const;

type IpFamily = 4 | 6;

interface ParsedCidr {
  family: IpFamily;
  network: bigint;
  prefix: number;
}

interface RateLimitEntry {
  timestamps: number[];
}

const requestLog = new Map<string, RateLimitEntry>();
let lastMaintenanceAt = 0;

const normalizeIp = (value: string | null | undefined) => {
  if (!value) return '';

  const trimmed = value.trim();
  const unwrapped = trimmed.startsWith('[') && trimmed.endsWith(']') ? trimmed.slice(1, -1) : trimmed;
  const normalized = unwrapped.replace(/^::ffff:/i, '');
  return isIP(normalized) ? normalized : '';
};

const ipv4ToBigInt = (value: string) =>
  value.split('.').reduce((result, segment) => (result << 8n) | BigInt(Number(segment)), 0n);

const ipv6ToBigInt = (value: string) => {
  const parts = value.toLowerCase().split('::');
  if (parts.length > 2) return null;

  const left = parts[0] ? parts[0].split(':') : [];
  const right = parts[1] ? parts[1].split(':') : [];
  const isCompressed = parts.length === 2;

  if ((!isCompressed && left.length !== 8) || left.length + right.length > 8) return null;

  const groups = [...left, ...Array(8 - left.length - right.length).fill('0'), ...right];
  if (groups.length !== 8 || groups.some((group) => !/^[0-9a-f]{1,4}$/i.test(group))) return null;

  return groups.reduce((result, group) => (result << 16n) | BigInt(Number.parseInt(group, 16)), 0n);
};

const ipToBigInt = (value: string, family: IpFamily) =>
  family === 4 ? ipv4ToBigInt(value) : ipv6ToBigInt(value);

const parseCidr = (value: string): ParsedCidr | null => {
  const [rawIp, rawPrefix, ...extra] = value.trim().split('/');
  if (!rawIp || !rawPrefix || extra.length) return null;

  const ip = normalizeIp(rawIp);
  const family = isIP(ip) as IpFamily;
  if (!family || !/^\d+$/.test(rawPrefix)) return null;

  const prefix = Number(rawPrefix);
  const bitLength = family === 4 ? 32 : 128;
  if (!Number.isSafeInteger(prefix) || prefix < 0 || prefix > bitLength) return null;

  const numericIp = ipToBigInt(ip, family);
  if (numericIp === null) return null;

  const suffixLength = BigInt(bitLength - prefix);
  const network = suffixLength === 0n ? numericIp : (numericIp >> suffixLength) << suffixLength;

  return { family, network, prefix };
};

const isIpInCidr = (ip: string, cidr: ParsedCidr) => {
  const family = isIP(ip) as IpFamily;
  if (family !== cidr.family) return false;

  const numericIp = ipToBigInt(ip, family);
  if (numericIp === null) return false;

  const bitLength = family === 4 ? 32 : 128;
  const suffixLength = BigInt(bitLength - cidr.prefix);
  const network = suffixLength === 0n ? numericIp : (numericIp >> suffixLength) << suffixLength;

  return network === cidr.network;
};

const cloudflareProxyRanges = CLOUDFLARE_PROXY_CIDRS.map(parseCidr).filter((range): range is ParsedCidr => range !== null);

const getConfiguredProxyRanges = () => {
  const raw = process.env.TRUSTED_PROXY_CIDRS?.trim();
  if (!raw) return [];

  const ranges = raw.split(',').map((value) => parseCidr(value));
  return ranges.every((range) => range !== null) ? (ranges as ParsedCidr[]) : [];
};

const trustsCloudflare = () => process.env.TRUST_PROXY?.trim().toLowerCase() === 'cloudflare';

const isTrustedProxy = (socketIp: string) =>
  getConfiguredProxyRanges().some((range) => isIpInCidr(socketIp, range)) ||
  (trustsCloudflare() && cloudflareProxyRanges.some((range) => isIpInCidr(socketIp, range)));

/**
 * Proxy headers are ignored by default. CF-Connecting-IP is read only after
 * the peer socket is verified against either explicitly configured proxy CIDRs
 * or Cloudflare's published ranges with TRUST_PROXY=cloudflare. X-Forwarded-For
 * and X-Real-IP are never used.
 */
export const getRateLimitClientIp = ({ request, clientAddress }: Pick<APIContext, 'request' | 'clientAddress'>) => {
  const socketIp = normalizeIp(clientAddress);
  if (!socketIp) return 'unknown';

  if (!isTrustedProxy(socketIp)) return socketIp;

  return normalizeIp(request.headers.get('cf-connecting-ip')) || socketIp;
};

const maintainRequestLog = (now: number) => {
  if (now - lastMaintenanceAt < MAINTENANCE_INTERVAL_MS && requestLog.size < MAX_TRACKED_CLIENTS) return;

  lastMaintenanceAt = now;
  const windowStart = now - WINDOW_MS;

  for (const [key, entry] of requestLog) {
    entry.timestamps = entry.timestamps.filter((timestamp) => timestamp > windowStart);
    if (!entry.timestamps.length) requestLog.delete(key);
  }
};

const getEarliestResetAt = (now: number) => {
  let earliest = now + WINDOW_MS;

  for (const entry of requestLog.values()) {
    if (entry.timestamps[0]) {
      earliest = Math.min(earliest, entry.timestamps[0] + WINDOW_MS);
    }
  }

  return earliest;
};

const buildRateLimitHeaders = (remaining: number, resetAt: number, now: number, retryAfterSeconds?: number) => ({
  'RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
  'RateLimit-Remaining': String(Math.max(0, remaining)),
  'RateLimit-Reset': String(Math.max(1, Math.ceil((resetAt - now) / 1000))),
  'RateLimit-Policy': `${MAX_REQUESTS_PER_WINDOW};w=${WINDOW_MS / 1000}`,
  ...(retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : {}),
});

export const checkRateLimit = ({ request, clientAddress }: Pick<APIContext, 'request' | 'clientAddress'>) => {
  const now = Date.now();
  maintainRequestLog(now);

  const key = getRateLimitClientIp({ request, clientAddress });
  const windowStart = now - WINDOW_MS;
  const existingEntry = requestLog.get(key);

  if (!existingEntry && requestLog.size >= MAX_TRACKED_CLIENTS) {
    const resetAt = getEarliestResetAt(now);
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));

    return jsonResponse(
      {
        success: false,
        message: RATE_LIMIT_ERROR,
      },
      429,
      buildRateLimitHeaders(0, resetAt, now, retryAfterSeconds)
    );
  }

  const entry = existingEntry ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((timestamp) => timestamp > windowStart);

  const resetAt = entry.timestamps[0] ? entry.timestamps[0] + WINDOW_MS : now + WINDOW_MS;

  if (entry.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
    requestLog.delete(key);
    requestLog.set(key, entry);

    return jsonResponse(
      {
        success: false,
        message: RATE_LIMIT_ERROR,
      },
      429,
      buildRateLimitHeaders(0, resetAt, now, retryAfterSeconds)
    );
  }

  entry.timestamps.push(now);
  requestLog.delete(key);
  requestLog.set(key, entry);

  return null;
};
