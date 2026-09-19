import type { APIRoute } from 'astro';
import { developmentRequestApiContent, getData } from '../../data';
import { getSmtpErrorMessage, sendSimpleEmail } from '../../server/email/sendEmail';
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

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_FORMAT_PATTERN = /^[+\d().\s-]+$/;
const apiCopy = developmentRequestApiContent;
const MAX_CONTACT_BODY_BYTES = 24 * 1024;
const CONTACT_FIELDS = new Set(['name', 'email', 'company', 'consultationType', 'message', 'lang']);

const isValidPhone = (value: string) => {
  if (!PHONE_FORMAT_PATTERN.test(value)) return false;

  const digitCount = (value.match(/\d/g) ?? []).length;
  return digitCount >= 7 && digitCount <= 15;
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const crossOriginResponse = rejectCrossOriginRequest(request);
  if (crossOriginResponse) return crossOriginResponse;

  if (!hasJsonContentType(request)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 415);
  }

  if (hasInvalidOrExcessiveContentLength(request, MAX_CONTACT_BODY_BYTES)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 413);
  }

  const rateLimitResponse = checkRateLimit({ request, clientAddress });
  if (rateLimitResponse) return rateLimitResponse;

  let payload: unknown;

  try {
    const rawBody = await readBodyWithinLimit(request, MAX_CONTACT_BODY_BYTES);
    if (!rawBody) {
      return jsonResponse({ success: false, message: apiCopy.invalidBody }, 413);
    }

    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(rawBody));
  } catch {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  if (!isPlainRecord(payload) || !hasOnlyAllowedKeys(payload, CONTACT_FIELDS)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const rawLang = normalizeText(payload.lang, { maxLength: 2 });
  if (!rawLang.ok || (rawLang.value && rawLang.value !== 'es' && rawLang.value !== 'en')) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const lang = rawLang.value === 'en' ? 'en' : 'es';
  const { developmentRequest } = getData(lang);
  const simpleContent = developmentRequest.developmentRequestSimpleContent;
  const validationCopy = simpleContent.form.validation;
  const name = normalizeText(payload.name, { maxLength: 120 });
  const email = normalizeText(payload.email, { maxLength: 254 });
  const company = normalizeText(payload.company, { maxLength: 32 });
  const consultationType = normalizeText(payload.consultationType, { maxLength: 100 });
  const message = normalizeText(payload.message, { maxLength: 5_000, allowLineBreaks: true });

  if (![name, email, company, consultationType, message].every((field) => field.ok)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  if (!name.value) {
    return jsonResponse({ success: false, message: validationCopy.nameRequired }, 400);
  }

  if (!email.value) {
    return jsonResponse({ success: false, message: validationCopy.emailRequired }, 400);
  }

  if (!EMAIL_PATTERN.test(email.value)) {
    return jsonResponse({ success: false, message: validationCopy.emailInvalid }, 400);
  }

  if (company.value && !isValidPhone(company.value)) {
    return jsonResponse({ success: false, message: validationCopy.companyInvalid }, 400);
  }

  if (!consultationType.value) {
    return jsonResponse({ success: false, message: validationCopy.consultationTypeRequired }, 400);
  }

  if (!simpleContent.consultationOptions.includes(consultationType.value)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  if (!message.value) {
    return jsonResponse({ success: false, message: validationCopy.messageRequired }, 400);
  }

  try {
    await sendSimpleEmail({
      from_name: name.value,
      reply_to: email.value,
      message: message.value,
      consultationType: consultationType.value,
      contact: company.value || (lang === 'en' ? 'Not specified' : 'No especificado'),
    });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Contact email send failed', {
      code: error && typeof error === 'object' && 'code' in error ? String(error.code) : 'UNKNOWN',
    });
    return jsonResponse({ success: false, message: getSmtpErrorMessage(error, lang) }, 500);
  }
};

export const ALL: APIRoute = async () =>
  jsonResponse(
    { success: false, message: apiCopy.methodNotAllowed },
    405,
    {
      Allow: 'POST',
    }
  );
