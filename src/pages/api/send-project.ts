import type { APIRoute } from 'astro';
import { developmentRequestApiContent, getData } from '../../data';
import { PROJECT_ATTACHMENT_FIELD, PROJECT_ATTACHMENT_MAX_BYTES, validateProjectAttachment, validateProjectAttachmentContent } from '../../lib/projectAttachment';
import { getSmtpErrorMessage, sendProjectEmail } from '../../server/email/sendEmail';
import { rejectCrossOriginRequest } from '../../server/security/origin';
import { checkRateLimit } from '../../server/security/rateLimit';
import {
  hasInvalidOrExcessiveContentLength,
  hasMultipartContentType,
  jsonResponse,
  normalizeText,
  readBodyWithinLimit,
} from '../../server/security/requestGuards';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const apiCopy = developmentRequestApiContent;
const MAX_PROJECT_BODY_BYTES = PROJECT_ATTACHMENT_MAX_BYTES + 256 * 1024;
const MAX_PROJECT_FORM_ENTRIES = 48;
const MAX_FEATURES = 20;
const MAX_INTEGRATIONS = 16;

const SCALAR_FIELDS = new Set([
  'fullName',
  'company',
  'email',
  'phone',
  'country',
  'projectType',
  'projectLevel',
  'pageRange',
  'designLevel',
  'hosting',
  'branding',
  'contentPlan',
  'timeline',
  'references',
  'projectDescription',
  'specialRequirements',
  'lang',
]);
const LIST_FIELDS = new Set(['features', 'integrations']);

const isUploadedFile = (value: FormDataEntryValue): value is File =>
  typeof File !== 'undefined' && value instanceof File;

const validateProjectFormShape = (payload: FormData) => {
  const fieldCounts = new Map<string, number>();
  let entryCount = 0;

  for (const [fieldName, value] of payload.entries()) {
    entryCount += 1;
    if (entryCount > MAX_PROJECT_FORM_ENTRIES) return false;

    const nextCount = (fieldCounts.get(fieldName) ?? 0) + 1;
    fieldCounts.set(fieldName, nextCount);

    if (fieldName === PROJECT_ATTACHMENT_FIELD) {
      if (nextCount > 1 || !isUploadedFile(value)) return false;
      continue;
    }

    if (LIST_FIELDS.has(fieldName)) {
      if (typeof value !== 'string') return false;
      continue;
    }

    if (!SCALAR_FIELDS.has(fieldName) || nextCount > 1 || typeof value !== 'string') {
      return false;
    }
  }

  return true;
};

const readChoiceList = (payload: FormData, fieldName: string, allowed: ReadonlySet<string>, maxItems: number) => {
  const values = payload.getAll(fieldName);

  if (values.length > maxItems) return null;

  const uniqueValues = new Set<string>();

  for (const value of values) {
    const normalized = normalizeText(value, { maxLength: 100 });
    if (!normalized.ok || !normalized.value || !allowed.has(normalized.value)) return null;
    uniqueValues.add(normalized.value);
  }

  return [...uniqueValues];
};

const isValidOptionalChoice = (value: string, allowed: ReadonlySet<string>) => !value || allowed.has(value);
const joinOrFallback = (items: string[], fallback: string) => (items.length ? items.join(', ') : fallback);

const buildScopeSummary = (
  projectType: string,
  projectLevel: string,
  pageRange: string,
  designLevel: string,
  featureCount: number,
  summaryFallbacks: {
    featureCountSingular: string;
    featureCountPlural: string;
    scopeDescription: string;
  }
) => {
  const parts = [projectType, projectLevel, pageRange, designLevel].filter(Boolean);

  if (featureCount > 0) {
    parts.push(
      `${featureCount} ${
        featureCount === 1 ? summaryFallbacks.featureCountSingular : summaryFallbacks.featureCountPlural
      }`
    );
  }

  return parts.length ? parts.join(' / ') : summaryFallbacks.scopeDescription;
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const crossOriginResponse = rejectCrossOriginRequest(request);
  if (crossOriginResponse) return crossOriginResponse;

  if (!hasMultipartContentType(request)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 415);
  }

  if (hasInvalidOrExcessiveContentLength(request, MAX_PROJECT_BODY_BYTES)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 413);
  }

  const rateLimitResponse = checkRateLimit({ request, clientAddress });
  if (rateLimitResponse) return rateLimitResponse;

  let payload: FormData;

  try {
    const rawBody = await readBodyWithinLimit(request, MAX_PROJECT_BODY_BYTES);
    if (!rawBody) {
      return jsonResponse({ success: false, message: apiCopy.invalidBody }, 413);
    }

    payload = await new Response(rawBody, {
      headers: {
        'Content-Type': request.headers.get('content-type') ?? '',
      },
    }).formData();
  } catch {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  if (!validateProjectFormShape(payload)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const rawLang = normalizeText(payload.get('lang'), { maxLength: 2 });
  if (!rawLang.ok || (rawLang.value && rawLang.value !== 'es' && rawLang.value !== 'en')) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const lang = rawLang.value === 'en' ? 'en' : 'es';
  const { developmentRequest } = getData(lang);
  const projectContent = developmentRequest.developmentRequestProjectContent;
  const wizardCopy = projectContent.ui;
  const notSpecified = lang === 'en' ? 'Not specified' : 'No especificado';

  const fullName = normalizeText(payload.get('fullName'), { maxLength: 120 });
  const company = normalizeText(payload.get('company'), { maxLength: 120 });
  const email = normalizeText(payload.get('email'), { maxLength: 254 });
  const phone = normalizeText(payload.get('phone'), { maxLength: 40 });
  const country = normalizeText(payload.get('country'), { maxLength: 80 });
  const projectType = normalizeText(payload.get('projectType'), { maxLength: 100 });
  const projectLevel = normalizeText(payload.get('projectLevel'), { maxLength: 100 });
  const pageRange = normalizeText(payload.get('pageRange'), { maxLength: 100 });
  const designLevel = normalizeText(payload.get('designLevel'), { maxLength: 100 });
  const hosting = normalizeText(payload.get('hosting'), { maxLength: 100 });
  const branding = normalizeText(payload.get('branding'), { maxLength: 100 });
  const contentPlan = normalizeText(payload.get('contentPlan'), { maxLength: 100 });
  const timeline = normalizeText(payload.get('timeline'), { maxLength: 100 });
  const references = normalizeText(payload.get('references'), { maxLength: 2_000, allowLineBreaks: true });
  const projectDescription = normalizeText(payload.get('projectDescription'), { maxLength: 6_000, allowLineBreaks: true });
  const specialRequirements = normalizeText(payload.get('specialRequirements'), { maxLength: 4_000, allowLineBreaks: true });

  const textFields = [
    fullName,
    company,
    email,
    phone,
    country,
    projectType,
    projectLevel,
    pageRange,
    designLevel,
    hosting,
    branding,
    contentPlan,
    timeline,
    references,
    projectDescription,
    specialRequirements,
  ];

  if (textFields.some((field) => !field.ok)) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  const projectTypeOptions = new Set(projectContent.projectTypeOptions);
  const projectLevelOptions = new Set(projectContent.projectLevelOptions);
  const pageOptions = new Set(projectContent.pageOptions);
  const designOptions = new Set(projectContent.designOptions);
  const featureOptions = new Set(projectContent.featureOptions);
  const integrationOptions = new Set(projectContent.integrationOptions);
  const hostingOptions = new Set(projectContent.hostingOptions);
  const brandingOptions = new Set(projectContent.brandingOptions);
  const contentOptions = new Set(projectContent.contentOptions);
  const timelineOptions = new Set(projectContent.timelineOptions);
  const features = readChoiceList(payload, 'features', featureOptions, MAX_FEATURES);
  const integrations = readChoiceList(payload, 'integrations', integrationOptions, MAX_INTEGRATIONS);

  if (
    !features ||
    !integrations ||
    !isValidOptionalChoice(projectType.value, projectTypeOptions) ||
    !isValidOptionalChoice(projectLevel.value, projectLevelOptions) ||
    !isValidOptionalChoice(pageRange.value, pageOptions) ||
    !isValidOptionalChoice(designLevel.value, designOptions) ||
    !isValidOptionalChoice(hosting.value, hostingOptions) ||
    !isValidOptionalChoice(branding.value, brandingOptions) ||
    !isValidOptionalChoice(contentPlan.value, contentOptions) ||
    !isValidOptionalChoice(timeline.value, timelineOptions)
  ) {
    return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
  }

  if (!fullName.value) {
    return jsonResponse({ success: false, message: wizardCopy.validation.fullNameRequired }, 400);
  }

  if (!email.value) {
    return jsonResponse({ success: false, message: wizardCopy.validation.emailRequired }, 400);
  }

  if (!EMAIL_PATTERN.test(email.value)) {
    return jsonResponse({ success: false, message: wizardCopy.validation.emailInvalid }, 400);
  }

  if (!phone.value) {
    return jsonResponse({ success: false, message: wizardCopy.validation.phoneRequired }, 400);
  }

  if (!projectDescription.value) {
    return jsonResponse({ success: false, message: wizardCopy.validation.projectDescriptionRequired }, 400);
  }

  const attachmentValue = payload.get(PROJECT_ATTACHMENT_FIELD);
  const attachment = attachmentValue && isUploadedFile(attachmentValue) ? attachmentValue : null;
  let emailAttachment:
    | {
        filename: string;
        content: Buffer;
        contentType: string;
      }
    | undefined;

  if (attachment) {
    const attachmentValidation = validateProjectAttachment(attachment, wizardCopy.fileValidation);

    if (!attachmentValidation.ok) {
      return jsonResponse({ success: false, message: attachmentValidation.message ?? apiCopy.invalidBody }, 400);
    }

    try {
      const contents = new Uint8Array(await attachment.arrayBuffer());
      const contentValidation = validateProjectAttachmentContent(attachment.name, contents);

      if (!contentValidation.ok || !contentValidation.contentType) {
        return jsonResponse(
          { success: false, message: wizardCopy.fileValidation.invalidType ?? apiCopy.invalidBody },
          400
        );
      }

      emailAttachment = {
        filename: attachment.name.trim(),
        content: Buffer.from(contents),
        contentType: contentValidation.contentType,
      };
    } catch {
      return jsonResponse({ success: false, message: apiCopy.invalidBody }, 400);
    }
  }

  const scope = buildScopeSummary(
    projectType.value,
    projectLevel.value,
    pageRange.value,
    designLevel.value,
    features.length,
    wizardCopy.summaryFallbacks
  );

  try {
    await sendProjectEmail({
      fullName: fullName.value,
      email: email.value,
      company: company.value || notSpecified,
      phone: phone.value,
      country: country.value || notSpecified,
      projectType: projectType.value || notSpecified,
      projectLevel: projectLevel.value || notSpecified,
      pageRange: pageRange.value || notSpecified,
      designLevel: designLevel.value || notSpecified,
      scope,
      features: joinOrFallback(features, wizardCopy.summaryFallbacks.features),
      integrations: joinOrFallback(integrations, wizardCopy.summaryFallbacks.integrations),
      hosting: hosting.value || notSpecified,
      branding: branding.value || notSpecified,
      contentPlan: contentPlan.value || notSpecified,
      timeline: timeline.value || notSpecified,
      references: references.value || wizardCopy.summaryFallbacks.references,
      uploadedFiles: emailAttachment ? emailAttachment.filename : lang === 'en' ? 'No listed files' : 'Sin archivos listados',
      brief: projectDescription.value,
      specialRequirements: specialRequirements.value || (lang === 'en' ? 'No special requirements' : 'Sin requerimientos especiales'),
      attachment: emailAttachment,
    });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Project email send failed', {
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
