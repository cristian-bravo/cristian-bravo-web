import type { ProjectRequestFormData } from '../types/projectRequest.types';

interface PersistWizardStateOptions {
  storageKey: string;
  currentStep: number;
  furthestStep: number;
  formData: ProjectRequestFormData;
}

export const persistWizardState = ({
  storageKey,
  currentStep,
  furthestStep,
  formData,
}: PersistWizardStateOptions) => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      currentStep,
      furthestStep,
      formData: {
        ...formData,
        uploadedFiles: [],
      },
    })
  );
};

export const restoreWizardState = <T>(storageKey: string, fallback: T) => {
  const rawState = window.localStorage.getItem(storageKey);
  if (!rawState) {
    return fallback;
  }

  return JSON.parse(rawState) as T;
};
