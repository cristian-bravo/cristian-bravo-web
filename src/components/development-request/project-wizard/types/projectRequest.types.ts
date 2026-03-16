import type { DevelopmentProjectFileValidationContent, DevelopmentProjectUiContent } from '../../../../data';

export interface ProjectRequestFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  projectType: string;
  projectLevel: string;
  pageRange: string;
  designLevel: string;
  features: string[];
  integrations: string[];
  hosting: string;
  branding: string;
  contentPlan: string;
  timeline: string;
  uploadedFiles: string[];
  references: string;
  projectDescription: string;
  specialRequirements: string;
}

export type ProjectRequestErrors = Partial<Record<keyof ProjectRequestFormData, string>>;
export type WizardStepDirection = 'forward' | 'backward';

export interface ProjectWizardConfig {
  stepTitles: string[];
  stepDescriptions: string[];
  ui: DevelopmentProjectUiContent;
  contactEmail: string;
  finalSubmitLabel: string;
  confirmModalTitle: string;
  confirmModalDescription: string;
  confirmModalCancelLabel: string;
  confirmModalConfirmLabel: string;
  successTitle: string;
  successDescription: string;
  storageKey: string;
  legacyStorageKey: string;
  attachmentField: string;
  attachmentMaxBytes: number;
  attachmentAccept: string;
}

export interface ProjectAttachmentLike {
  name: string;
  size: number;
}

export interface ProjectAttachmentValidationResult {
  ok: boolean;
  message?: string;
}

export interface ProjectAttachmentValidationMessages extends DevelopmentProjectFileValidationContent {}

export interface ProjectEmailAttachment {
  filename: string;
  file: File;
}

export const DEFAULT_PROJECT_REQUEST_FORM_DATA: ProjectRequestFormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  projectType: '',
  projectLevel: '',
  pageRange: '',
  designLevel: '',
  features: [],
  integrations: [],
  hosting: '',
  branding: '',
  contentPlan: '',
  timeline: '',
  uploadedFiles: [],
  references: '',
  projectDescription: '',
  specialRequirements: '',
};
