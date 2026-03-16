import type { DevelopmentProjectSummaryFallbacksContent } from '../../../../data';
import type { ProjectRequestErrors, ProjectRequestFormData } from '../types/projectRequest.types';
import { buildCompactList, buildScopeSummary, compactText } from './wizardHelpers';

export const createFieldErrorSetter = (root: HTMLElement) => (fieldName: string, message = '') => {
  const field = root.querySelector(`[data-field="${fieldName}"]`);
  const error = root.querySelector(`[data-error-for="${fieldName}"]`);

  if (field instanceof HTMLElement) {
    field.classList.toggle('is-invalid', Boolean(message));
  }

  if (error instanceof HTMLElement) {
    error.textContent = message;
    error.hidden = !message;
  }
};

export const showFieldErrors = (
  setFieldError: (fieldName: string, message?: string) => void,
  errors: ProjectRequestErrors,
  fields: (keyof ProjectRequestFormData)[]
) => {
  fields.forEach((fieldName) => setFieldError(fieldName, errors[fieldName] || ''));
};

export const focusFirstInvalidField = (root: HTMLElement) => {
  root.querySelector<HTMLElement>('.development-step-panel:not([hidden]) .is-invalid')?.focus();
};

export const createSummaryUpdater =
  (root: HTMLElement, summaryCopy: DevelopmentProjectSummaryFallbacksContent) =>
  (formData: ProjectRequestFormData) => {
    const separator = ' • ';
    const clientMeta = [formData.company, formData.phone, formData.country].filter(Boolean).join(separator);
    const deliverySummary = [formData.timeline, formData.hosting].filter(Boolean).join(separator);
    const brandSummary = [formData.designLevel, formData.branding, formData.contentPlan].filter(Boolean).join(separator);
    const referencesSummary = buildCompactList(formData.uploadedFiles, summaryCopy.noFiles, 2);
    const summaryMap: Record<string, string> = {
      '[data-summary-contact-name]': formData.fullName || summaryCopy.contactName,
      '[data-summary-contact-email]': formData.email || summaryCopy.contactEmail,
      '[data-summary-contact-meta]': clientMeta,
      '[data-summary-scope-title]': formData.projectType || summaryCopy.scopeTitle,
      '[data-summary-scope-detail]': buildScopeSummary(formData, {
        fallback: summaryCopy.scopeDescription,
        featureCountSingular: summaryCopy.featureCountSingular,
        featureCountPlural: summaryCopy.featureCountPlural,
      }),
      '[data-summary-stack-features]': buildCompactList(formData.features, summaryCopy.features, 4),
      '[data-summary-stack-integrations]': buildCompactList(formData.integrations, summaryCopy.integrations, 3),
      '[data-summary-stack-meta]': compactText(
        [deliverySummary, brandSummary].filter(Boolean).join(separator),
        summaryCopy.stackMeta,
        110
      ),
      '[data-summary-brief]': compactText(formData.projectDescription, summaryCopy.brief, 150),
      '[data-summary-notes]': compactText(formData.specialRequirements, summaryCopy.notes, 120),
      '[data-summary-assets]': compactText(
        [formData.references, referencesSummary].filter(Boolean).join(separator),
        summaryCopy.assets,
        110
      ),
    };

    Object.entries(summaryMap).forEach(([selector, value]) => {
      const node = root.querySelector(selector);
      if (node instanceof HTMLElement) {
        node.textContent = value;
      }
    });
  };

export const clearWizardFieldErrors = (root: HTMLElement) => {
  root.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
  root.querySelectorAll<HTMLElement>('[data-error-for]').forEach((node) => {
    node.textContent = '';
    node.hidden = true;
  });
};
