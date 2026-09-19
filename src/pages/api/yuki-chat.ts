import { randomBytes } from 'node:crypto';
import type { APIRoute } from 'astro';
import { rejectCrossOriginRequest } from '../../server/security/origin';
import { checkRateLimit } from '../../server/security/rateLimit';
import {
  hasInvalidOrExcessiveContentLength,
  hasJsonContentType,
  hasOnlyAllowedKeys,
  isPlainRecord,
  jsonResponse,
  normalizeText,
  readBodyWithinLimit,
} from '../../server/security/requestGuards';
import { askYukiSiteChat } from '../../server/yuki/siteChat';

export const prerender = false;

const COOKIE_NAME = 'cystems_yuki_session';
const MEMORY_STATE_COOKIE_NAME = 'cystems_yuki_memory_state';
const MEMORY_STATE_EPHEMERAL = 'ephemeral';
const MEMORY_STATE_GRANTED = 'granted';
const MESSAGE_MAX_LENGTH = 1_200;
const MAX_YUKI_CHAT_BODY_BYTES = 8 * 1024;
const SESSION_PATTERN = /^site_[a-f0-9]{32}$/;
const YUKI_CHAT_FIELDS = new Set(['message', 'remember']);

const nextVisitorId = () => `site_${randomBytes(16).toString('hex')}`;

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const originError = rejectCrossOriginRequest(request);
  if (originError) return originError;

  if (!hasJsonContentType(request)) {
    return jsonResponse({ success: false, message: 'Formato de solicitud no v\u00e1lido.' }, 415);
  }

  if (hasInvalidOrExcessiveContentLength(request, MAX_YUKI_CHAT_BODY_BYTES)) {
    return jsonResponse({ success: false, message: 'Formato de solicitud no v\u00e1lido.' }, 413);
  }

  // Count every accepted content type before the upstream request. This holds
  // even while Yuki is unavailable, preventing the proxy from becoming a
  // retry amplifier during an outage.
  const rateLimitResponse = checkRateLimit({ request, clientAddress });
  if (rateLimitResponse) return rateLimitResponse;

  let payload: unknown;
  try {
    const rawBody = await readBodyWithinLimit(request, MAX_YUKI_CHAT_BODY_BYTES);
    if (!rawBody) {
      return jsonResponse({ success: false, message: 'Formato de solicitud no v\u00e1lido.' }, 413);
    }

    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(rawBody));
  } catch {
    return jsonResponse({ success: false, message: 'Formato de solicitud no v\u00e1lido.' }, 400);
  }

  if (
    !isPlainRecord(payload) ||
    typeof payload.message !== 'string' ||
    typeof payload.remember !== 'boolean' ||
    !hasOnlyAllowedKeys(payload, YUKI_CHAT_FIELDS)
  ) {
    return jsonResponse({ success: false, message: 'Escribe un mensaje para Yuki.' }, 400);
  }

  const normalizedMessage = normalizeText(payload.message, {
    allowLineBreaks: true,
    maxLength: MESSAGE_MAX_LENGTH,
  });
  if (!normalizedMessage.ok || !normalizedMessage.value) {
    return jsonResponse(
      { success: false, message: `El mensaje debe tener entre 1 y ${MESSAGE_MAX_LENGTH} caracteres.` },
      400
    );
  }

  const storedVisitorId = cookies.get(COOKIE_NAME)?.value;
  const storedMemoryState = cookies.get(MEMORY_STATE_COOKIE_NAME)?.value;
  const validStoredVisitorId = storedVisitorId && SESSION_PATTERN.test(storedVisitorId) ? storedVisitorId : undefined;
  // A missing state cookie is treated as potentially consented legacy state,
  // so the first no-consent request after this change severs that identifier.
  const rotateVisitor = !payload.remember && storedMemoryState !== MEMORY_STATE_EPHEMERAL;
  const visitorId = !rotateVisitor && validStoredVisitorId ? validStoredVisitorId : nextVisitorId();

  // The opaque visitor key is persistent only after opt-in. On revocation it
  // is rotated, rewritten as a session cookie, and cannot link new turns to
  // the identifier that scoped previously consented memory.
  const cookieOptions = {
    httpOnly: true,
    ...(payload.remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    path: '/',
    sameSite: 'strict' as const,
    secure: import.meta.env.PROD,
  };
  cookies.set(COOKIE_NAME, visitorId, cookieOptions);
  cookies.set(
    MEMORY_STATE_COOKIE_NAME,
    payload.remember ? MEMORY_STATE_GRANTED : MEMORY_STATE_EPHEMERAL,
    cookieOptions
  );

  const result = await askYukiSiteChat({
    message: normalizedMessage.value,
    remember: payload.remember,
    visitorId,
  });

  if (!result.available) {
    return jsonResponse(
      {
        success: false,
        code: 'YUKI_UNAVAILABLE',
        message: 'Yuki no est\u00e1 disponible en este momento. Int\u00e9ntalo m\u00e1s tarde.',
      },
      503
    );
  }

  if (!result.ok) {
    return jsonResponse(
      { success: false, message: 'Yuki no pudo responder ahora. Int\u00e9ntalo nuevamente en unos segundos.' },
      502
    );
  }

  return jsonResponse({ success: true, response: result.response });
};

export const ALL: APIRoute = async () =>
  jsonResponse(
    { success: false, message: 'M\u00e9todo no permitido.' },
    405,
    { Allow: 'POST' }
  );
