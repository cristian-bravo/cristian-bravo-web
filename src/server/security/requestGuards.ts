const API_JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const DISALLOWED_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const LINE_BREAKS = /[\r\n]/;

export interface TextFieldOptions {
  maxLength: number;
  allowLineBreaks?: boolean;
}

export interface NormalizedTextResult {
  ok: boolean;
  value: string;
}

export const jsonResponse = (
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...API_JSON_HEADERS,
      ...extraHeaders,
    },
  });

export const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getMediaType = (request: Request) => request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();

export const hasJsonContentType = (request: Request) => getMediaType(request) === 'application/json';

export const hasMultipartContentType = (request: Request) => getMediaType(request) === 'multipart/form-data';

export const hasInvalidOrExcessiveContentLength = (request: Request, maxBytes: number) => {
  const headerValue = request.headers.get('content-length');

  if (!headerValue) return false;
  if (!/^\d+$/.test(headerValue)) return true;

  const contentLength = Number(headerValue);
  return !Number.isSafeInteger(contentLength) || contentLength > maxBytes;
};

/**
 * Enforces the byte limit even when Content-Length is absent or forged. The
 * caller owns the parsed representation, so request bodies are consumed once.
 */
export const readBodyWithinLimit = async (request: Request, maxBytes: number) => {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // The request is already rejected; cancellation failures are not client errors.
        }
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body;
};

/**
 * Normalizes user text without silently altering control characters. Newlines
 * are allowed only in body-style fields that are never used as mail headers.
 */
export const normalizeText = (value: unknown, options: TextFieldOptions): NormalizedTextResult => {
  if (value === null || value === undefined) {
    return { ok: true, value: '' };
  }

  if (typeof value !== 'string') {
    return { ok: false, value: '' };
  }

  const normalized = value.trim();

  if (
    normalized.length > options.maxLength ||
    DISALLOWED_CONTROL_CHARACTERS.test(normalized) ||
    (!options.allowLineBreaks && LINE_BREAKS.test(normalized))
  ) {
    return { ok: false, value: '' };
  }

  return { ok: true, value: normalized };
};

export const hasOnlyAllowedKeys = (payload: Record<string, unknown>, allowedKeys: ReadonlySet<string>) =>
  Object.keys(payload).every((key) => allowedKeys.has(key));
