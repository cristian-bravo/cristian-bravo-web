import type { APIRoute } from 'astro';
import { developmentRequestApiContent, getData } from '../../data';
import { getSmtpErrorMessage, sendProjectEmail } from '../../server/email/sendEmail';
import { PROJECT_ATTACHMENT_FIELD, validateProjectAttachment } from '../../lib/projectAttachment';
import { checkRateLimit } from '../../server/security/rateLimit';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { developmentRequest } = getData('es');
const apiCopy = developmentRequestApiContent;
const wizardCopy = developmentRequest.ui;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getString = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');
const getStringArray = (value: FormDataEntryValue[]) =>
  value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);

const joinOrFallback = (items: string[], fallback: string) => (items.length ? items.join(', ') : fallback);

const buildScopeSummary = (
  projectType: string,
  projectLevel: string,
  pageRange: string,
  designLevel: string,
  featureCount: number
) => {
  const parts = [projectType, projectLevel, pageRange, designLevel].filter(Boolean);

  if (featureCount > 0) {
    parts.push(
      `${featureCount} ${
        featureCount === 1
          ? wizardCopy.summaryFallbacks.featureCountSingular
          : wizardCopy.summaryFallbacks.featureCountPlural
      }`
    );
  }

  return parts.length ? parts.join(' / ') : wizardCopy.summaryFallbacks.scopeDescription;
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const rateLimitResponse = checkRateLimit({ request, clientAddress });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let payload: FormData;

  try {
    payload = await request.formData();
  } catch {
    return json({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const fullName = getString(payload.get('fullName'));
  const company = getString(payload.get('company'));
  const email = getString(payload.get('email'));
  const phone = getString(payload.get('phone'));
  const country = getString(payload.get('country'));
  const projectType = getString(payload.get('projectType'));
  const projectLevel = getString(payload.get('projectLevel'));
  const pageRange = getString(payload.get('pageRange'));
  const designLevel = getString(payload.get('designLevel'));
  const features = getStringArray(payload.getAll('features'));
  const integrations = getStringArray(payload.getAll('integrations'));
  const hosting = getString(payload.get('hosting'));
  const branding = getString(payload.get('branding'));
  const contentPlan = getString(payload.get('contentPlan'));
  const timeline = getString(payload.get('timeline'));
  const references = getString(payload.get('references'));
  const projectDescription = getString(payload.get('projectDescription'));
  const specialRequirements = getString(payload.get('specialRequirements'));
  const fileValue = payload.get(PROJECT_ATTACHMENT_FIELD);
  const attachment =
    typeof File !== 'undefined' && fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  if (attachment) {
    const attachmentValidation = validateProjectAttachment(attachment, wizardCopy.fileValidation);

    if (!attachmentValidation.ok) {
      return json({ success: false, message: attachmentValidation.message }, 400);
    }
  }

  const uploadedFiles = attachment ? [attachment.name] : [];

  if (!fullName) {
    return json({ success: false, message: wizardCopy.validation.fullNameRequired }, 400);
  }

  if (!email) {
    return json({ success: false, message: wizardCopy.validation.emailRequired }, 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return json({ success: false, message: wizardCopy.validation.emailInvalid }, 400);
  }

  if (!phone) {
    return json({ success: false, message: wizardCopy.validation.phoneRequired }, 400);
  }

  if (!projectDescription) {
    return json({ success: false, message: wizardCopy.validation.projectDescriptionRequired }, 400);
  }

  const scope = buildScopeSummary(projectType, projectLevel, pageRange, designLevel, features.length);

  try {
    const emailAttachment = attachment
      ? {
          filename: attachment.name,
          content: Buffer.from(await attachment.arrayBuffer()),
          contentType: attachment.type || undefined,
        }
      : undefined;

    await sendProjectEmail({
      fullName,
      email,
      company: company || 'No especificado',
      phone: phone || 'No especificado',
      country: country || 'No especificado',
      projectType: projectType || 'No especificado',
      projectLevel: projectLevel || 'No especificado',
      pageRange: pageRange || 'No especificado',
      designLevel: designLevel || 'No especificado',
      scope,
      features: joinOrFallback(features, wizardCopy.summaryFallbacks.features),
      integrations: joinOrFallback(integrations, wizardCopy.summaryFallbacks.integrations),
      hosting: hosting || 'No especificado',
      branding: branding || 'No especificado',
      contentPlan: contentPlan || 'No especificado',
      timeline: timeline || 'No especificado',
      references: references || wizardCopy.summaryFallbacks.references,
      uploadedFiles: joinOrFallback(uploadedFiles, 'Sin archivos listados'),
      brief: projectDescription,
      specialRequirements: specialRequirements || 'Sin requerimientos especiales',
      attachment: emailAttachment,
    });

    return json({ success: true });
  } catch (error) {
    console.error('Project email send failed', error);
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
