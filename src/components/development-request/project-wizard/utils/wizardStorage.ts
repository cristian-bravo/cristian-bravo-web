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
  try {
    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        currentStep,
        furthestStep,
        formData: { ...formData, uploadedFiles: [] },
      })
    );
    return true;
  } catch {
    // Storage can be unavailable in private browsing or when its quota is full.
    // Saving a draft is optional; it must never prevent completing a request.
    return false;
  }
};

export const restoreWizardState = <T>(storageKey: string, fallback: T) => {
  try {
    const rawState = window.sessionStorage.getItem(storageKey);
    if (!rawState) return fallback;
    const parsed = JSON.parse(rawState);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as T : fallback;
  } catch {
    return fallback;
  }
};

export const removeWizardState = (storageKey: string) => {
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // No persisted draft can be removed when browser storage is inaccessible.
  }
};

export const clearLegacyWizardState = (...storageKeys: string[]) => {
  try {
    // Older versions persisted contact details across browsing sessions.
    // Remove only this form's known keys; all other site preferences remain.
    storageKeys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // A blocked persistent store must not break the current tab's form.
  }
};
