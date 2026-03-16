import type { DevelopmentProjectValidationContent } from '../../../../data';
import type { ProjectRequestErrors, ProjectRequestFormData } from '../types/projectRequest.types';
import { EMAIL_PATTERN } from './wizardHelpers';

const getNamedFieldValue = (form: HTMLFormElement, fieldName: string) => {
  const field = form.elements.namedItem(fieldName);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return field.value.trim();
  }
  return '';
};

const getNamedCheckedValues = (form: HTMLFormElement, fieldName: string) =>
  Array.from(form.querySelectorAll(`input[name="${fieldName}"]:checked`))
    .map((input) => (input instanceof HTMLInputElement ? input.value.trim() : ''))
    .filter(Boolean);

export const collectProjectFormData = (
  form: HTMLFormElement,
  getUploadedFileNames: () => string[]
): ProjectRequestFormData => ({
  fullName: getNamedFieldValue(form, 'fullName'),
  company: getNamedFieldValue(form, 'company'),
  email: getNamedFieldValue(form, 'email'),
  phone: getNamedFieldValue(form, 'phone'),
  country: getNamedFieldValue(form, 'country'),
  projectType: getNamedFieldValue(form, 'projectType'),
  projectLevel: getNamedFieldValue(form, 'projectLevel'),
  pageRange: getNamedFieldValue(form, 'pageRange'),
  designLevel: getNamedFieldValue(form, 'designLevel'),
  features: getNamedCheckedValues(form, 'features'),
  integrations: getNamedCheckedValues(form, 'integrations'),
  hosting: getNamedFieldValue(form, 'hosting'),
  branding: getNamedFieldValue(form, 'branding'),
  contentPlan: getNamedFieldValue(form, 'contentPlan'),
  timeline: getNamedFieldValue(form, 'timeline'),
  uploadedFiles: getUploadedFileNames(),
  references: getNamedFieldValue(form, 'references'),
  projectDescription: getNamedFieldValue(form, 'projectDescription'),
  specialRequirements: getNamedFieldValue(form, 'specialRequirements'),
});

export const restoreProjectFormData = (
  form: HTMLFormElement,
  formData: Partial<ProjectRequestFormData>
) => {
  Object.entries(formData).forEach(([fieldName, value]) => {
    if (fieldName === 'features' || fieldName === 'integrations') {
      const valueSet = new Set(Array.isArray(value) ? value : []);
      form.querySelectorAll(`input[name="${fieldName}"]`).forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.checked = valueSet.has(input.value);
          input.closest('.development-checkbox-card')?.classList.toggle('is-checked', input.checked);
        }
      });
      return;
    }

    if (fieldName === 'uploadedFiles') {
      return;
    }

    const field = form.elements.namedItem(fieldName);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      field.value = typeof value === 'string' ? value : '';
    }
  });
};

export const validateProjectEssentials = (
  formData: ProjectRequestFormData,
  messages: DevelopmentProjectValidationContent
) => {
  const errors: ProjectRequestErrors = {};

  if (!formData.fullName) {
    errors.fullName = messages.fullNameRequired;
  }

  if (!formData.email) {
    errors.email = messages.emailRequired;
  } else if (!EMAIL_PATTERN.test(formData.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!formData.phone) {
    errors.phone = messages.phoneRequired;
  }

  if (!formData.projectDescription) {
    errors.projectDescription = messages.projectDescriptionRequired;
  }

  return errors;
};
