import type { APIRoute } from 'astro';
import { developmentRequestApiContent, getData } from '../../data';
import { getSmtpErrorMessage, sendSimpleEmail } from '../../server/email/sendEmail';
import { checkRateLimit } from '../../server/security/rateLimit';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_PATTERN = /^[0-9]+$/;
const apiCopy = developmentRequestApiContent;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const rateLimitResponse = checkRateLimit({ request, clientAddress });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const name = getString(payload.name);
  const email = getString(payload.email);
  const company = getString(payload.company);
  const consultationType = getString(payload.consultationType);
  const message = getString(payload.message);
  const lang = getString(payload.lang) === 'en' ? 'en' : 'es';
  const { developmentRequest } = getData(lang);
  const validationCopy = developmentRequest.developmentRequestSimpleContent.form.validation;

  if (!name) {
    return json({ success: false, message: validationCopy.nameRequired }, 400);
  }

  if (!email) {
    return json({ success: false, message: validationCopy.emailRequired }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return json({ success: false, message: validationCopy.emailInvalid }, 400);
  }

  if (company && !DIGITS_PATTERN.test(company)) {
    return json({ success: false, message: validationCopy.companyInvalid }, 400);
  }

  if (!consultationType) {
    return json({ success: false, message: validationCopy.consultationTypeRequired }, 400);
  }

  if (!message) {
    return json({ success: false, message: validationCopy.messageRequired }, 400);
  }

  try {
    await sendSimpleEmail({
      from_name: name,
      reply_to: email,
      subject: `Solicitud simple - ${consultationType}`,
      message,
      consultationType,
      contact: company || (lang === 'en' ? 'Not specified' : 'No especificado'),
    });

    return json({ success: true });
  } catch (error) {
    console.error('Contact email send failed', error);
    return json({ success: false, message: getSmtpErrorMessage(error) }, 500);
  }
};

export const ALL: APIRoute = async () =>
  new Response(JSON.stringify({ success: false, message: apiCopy.methodNotAllowed }), {
    status: 405,
    headers: {
      Allow: 'POST',
      'Content-Type': 'application/json',
    },
  });
