import { useConfirmModal } from './hooks/useConfirmModal';
import { useFileValidation } from './hooks/useFileValidation';
import { useWizardState } from './hooks/useWizardState';
import { sendProjectRequest } from './services/projectRequestService';
import {
  DEFAULT_PROJECT_REQUEST_FORM_DATA,
  type ProjectRequestFormData,
  type ProjectWizardConfig,
} from './types/projectRequest.types';
import { formatSavedTime } from './utils/wizardHelpers';
import { collectProjectFormData, restoreProjectFormData, validateProjectEssentials } from './utils/projectFormData';
import {
  clearWizardFieldErrors,
  createFieldErrorSetter,
  createSummaryUpdater,
  focusFirstInvalidField,
  showFieldErrors,
} from './utils/wizardDom';
import { persistWizardState, restoreWizardState } from './utils/wizardStorage';
import { renderWizardState } from './utils/wizardUi';

const REQUIRED_FIELDS: (keyof ProjectRequestFormData)[] = ['fullName', 'email', 'phone', 'projectDescription'];

export const initProjectRequestWizard = (root: Element) => {
  if (!(root instanceof HTMLElement) || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const configNode = root.querySelector<HTMLScriptElement>('[data-project-wizard-config]');
  const form = root.querySelector<HTMLFormElement>('[data-project-wizard-form]');
  const modal = root.querySelector<HTMLElement>('[data-confirm-modal]');
  const modalPanel = root.querySelector<HTMLElement>('[data-confirm-panel]');
  const fileInput = root.querySelector<HTMLInputElement>('[data-file-input]');
  const uploadList = root.querySelector<HTMLElement>('[data-upload-list]');
  const uploadPlaceholder = root.querySelector<HTMLElement>('[data-upload-placeholder]');
  const confirmCancel = root.querySelector<HTMLButtonElement>('[data-confirm-cancel]');

  if (!configNode || !form || !modal || !modalPanel || !fileInput || !uploadList || !uploadPlaceholder || !confirmCancel) {
    return;
  }

  const config = JSON.parse(configNode.textContent || '{}') as ProjectWizardConfig;
  const wizardCopy = config.ui;
  const state = useWizardState(config.stepTitles.length);
  const setFieldError = createFieldErrorSetter(root);
  const updateSummary = createSummaryUpdater(root, wizardCopy.summaryFallbacks);

  let submitted = false;
  let restored = false;
  let isSending = false;

  const fileValidation = useFileValidation({
    fileInput,
    uploadList,
    uploadPlaceholder,
    messages: wizardCopy.fileValidation,
    setFieldError,
    onChange: () => {
      persistState();
      updateSummary(collectFormData());
    },
  });

  const modalController = useConfirmModal({
    modal,
    modalPanel,
    cancelButton: confirmCancel,
    isSending: () => isSending,
  });

  const stepCounter = root.querySelector<HTMLElement>('[data-step-counter]');
  const stepTitle = root.querySelector<HTMLElement>('[data-step-title]');
  const stepDescription = root.querySelector<HTMLElement>('[data-step-description]');
  const savedPill = root.querySelector<HTMLElement>('[data-saved-pill]');
  const restoredStatus = root.querySelector<HTMLElement>('[data-restored-status]');
  const progressFill = root.querySelector<HTMLElement>('[data-progress-fill]');
  const errorBlock = root.querySelector<HTMLElement>('[data-submit-error]');
  const errorText = root.querySelector<HTMLElement>('[data-submit-error-text]');
  const successCard = root.querySelector<HTMLElement>('[data-submit-success]');
  const nextButton = root.querySelector<HTMLButtonElement>('[data-next-button]');
  const backButton = root.querySelector<HTMLButtonElement>('[data-back-button]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-reset-button]');
  const modalBackdrop = root.querySelector<HTMLButtonElement>('[data-confirm-backdrop]');
  const confirmSend = root.querySelector<HTMLButtonElement>('[data-confirm-send]');
  const confirmSendLabel = root.querySelector<HTMLElement>('[data-confirm-send-label]');
  const confirmSendIcon = root.querySelector<HTMLElement>('[data-confirm-send-icon]');
  const stepPanels = Array.from(root.querySelectorAll<HTMLElement>('[data-step-panel]'));
  const stepChips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-step-chip]'));

  if (
    !stepCounter ||
    !stepTitle ||
    !stepDescription ||
    !savedPill ||
    !restoredStatus ||
    !progressFill ||
    !errorBlock ||
    !errorText ||
    !successCard ||
    !nextButton ||
    !backButton ||
    !resetButton ||
    !modalBackdrop ||
    !confirmSend ||
    !confirmSendLabel ||
    !confirmSendIcon
  ) {
    return;
  }

  const collectFormData = () => collectProjectFormData(form, fileValidation.getUploadedFileNames);

  const clearSubmissionError = () => {
    errorText.textContent = '';
    errorBlock.hidden = true;
  };

  const setSubmissionError = (message: string) => {
    errorText.textContent = message;
    errorBlock.hidden = false;
  };

  const persistState = () => {
    if (submitted) return;

    const snapshot = state.getSnapshot();
    persistWizardState({
      storageKey: config.storageKey,
      currentStep: snapshot.currentStep,
      furthestStep: snapshot.furthestStep,
      formData: collectFormData(),
    });

    savedPill.textContent = `${wizardCopy.savePrefix} ${formatSavedTime(new Date())}`;
    savedPill.hidden = false;
  };

  const renderState = () => {
    const snapshot = state.getSnapshot();

    renderWizardState({
      stepTitles: config.stepTitles,
      stepDescriptions: config.stepDescriptions,
      counterTemplate: wizardCopy.stepCounterTemplate,
      backLabel: wizardCopy.backLabel,
      nextLabel: wizardCopy.nextLabel,
      finalSubmitLabel: config.finalSubmitLabel,
      isSending,
      currentStep: snapshot.currentStep,
      direction: snapshot.direction,
      canAccessStep: state.canAccessStep,
      stepCounter,
      stepTitle,
      stepDescription,
      progressFill,
      nextButton,
      backButton,
      stepPanels,
      stepChips,
    });
  };

  const goToStep = (step: number) => {
    if (!state.canAccessStep(step) || isSending) return;
    state.setStep(step);
    renderState();
    persistState();
  };

  const handleValidationFailure = (formData: ProjectRequestFormData) => {
    const errors = validateProjectEssentials(formData, wizardCopy.validation);
    showFieldErrors(setFieldError, errors, REQUIRED_FIELDS);
    return errors;
  };

  const restoreState = () => {
    try {
      window.localStorage.removeItem(config.legacyStorageKey);
      const parsed = restoreWizardState<{ currentStep?: number; furthestStep?: number; formData?: Partial<ProjectRequestFormData> }>(
        config.storageKey,
        {}
      );
      if (!Object.keys(parsed).length) return;

      restoreProjectFormData(form, parsed.formData || DEFAULT_PROJECT_REQUEST_FORM_DATA);
      state.restore(Number(parsed.currentStep) || 1, Number(parsed.furthestStep) || 1);
      restored = true;
      restoredStatus.hidden = false;
      savedPill.textContent = `${wizardCopy.savePrefix} ${formatSavedTime(new Date())}`;
      savedPill.hidden = false;
    } catch {
      window.localStorage.removeItem(config.storageKey);
    }
  };

  const resetWizard = () => {
    form.reset();
    submitted = false;
    clearSubmissionError();
    fileValidation.clearAttachment();
    state.reset();
    form.hidden = false;
    successCard.hidden = true;
    savedPill.hidden = true;
    restoredStatus.hidden = true;
    clearWizardFieldErrors(root);
    window.localStorage.removeItem(config.storageKey);
    renderState();
    updateSummary(collectFormData());
  };

  const handleFinalSubmit = async () => {
    if (isSending) return;

    const formData = collectFormData();
    const errors = handleValidationFailure(formData);

    if (Object.keys(errors).length || !fileValidation.validateAttachment()) {
      modalController.close(true);
      state.restore(Object.keys(errors).length ? 1 : config.stepTitles.length, state.getSnapshot().furthestStep);
      renderState();
      if (Object.keys(errors).length) {
        focusFirstInvalidField(root);
      } else {
        fileInput.focus();
      }
      return;
    }

    isSending = true;
    clearSubmissionError();
    confirmSend.disabled = true;
    confirmSendLabel.textContent = wizardCopy.sendingLabel;
    confirmSendIcon.hidden = true;
    renderState();

    try {
      await sendProjectRequest(formData, {
        attachmentField: config.attachmentField,
        attachment: fileValidation.getSelectedAttachment(),
      });

      submitted = true;
      window.localStorage.removeItem(config.storageKey);
      form.hidden = true;
      successCard.hidden = false;
      modalController.close(true);
    } catch (error) {
      setSubmissionError(error instanceof Error && error.message ? error.message : wizardCopy.submitError);
      modalController.close(true);
    } finally {
      isSending = false;
      confirmSend.disabled = false;
      confirmSendLabel.textContent = config.confirmModalConfirmLabel || '';
      confirmSendIcon.hidden = false;
      renderState();
    }
  };

  const handlePrimaryAction = () => {
    if (isSending) return;

    const formData = collectFormData();
    const snapshot = state.getSnapshot();
    const isFinalStep = snapshot.currentStep === config.stepTitles.length;

    if (!isFinalStep && snapshot.currentStep === 1) {
      const errors = handleValidationFailure(formData);
      if (Object.keys(errors).length) {
        focusFirstInvalidField(root);
        return;
      }
    }

    if (!isFinalStep) {
      state.goNext();
      renderState();
      persistState();
      return;
    }

    const errors = handleValidationFailure(formData);

    if (Object.keys(errors).length) {
      state.restore(1, state.getSnapshot().furthestStep);
      renderState();
      focusFirstInvalidField(root);
      return;
    }

    if (!fileValidation.validateAttachment()) {
      state.restore(config.stepTitles.length, state.getSnapshot().furthestStep);
      renderState();
      fileInput.focus();
      return;
    }

    updateSummary(formData);
    modalController.open();
  };

  restoreState();
  fileValidation.renderUploadList();
  renderState();
  updateSummary(collectFormData());
  if (!restored) {
    restoredStatus.hidden = true;
  }

  stepChips.forEach((chip) => chip.addEventListener('click', () => goToStep(Number(chip.dataset.stepChip))));
  resetButton.addEventListener('click', resetWizard);
  modalBackdrop.addEventListener('click', () => modalController.close());
  confirmCancel.addEventListener('click', () => modalController.close());
  confirmSend.addEventListener('click', handleFinalSubmit);

  form.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const fieldName = target.dataset.field;
    if (fieldName) {
      setFieldError(fieldName, '');
    }

    if (target instanceof HTMLInputElement && (target.name === 'features' || target.name === 'integrations')) {
      target.closest('.development-checkbox-card')?.classList.toggle('is-checked', target.checked);
    }

    clearSubmissionError();
    persistState();
    updateSummary(collectFormData());
  });

  form.addEventListener('change', (event) => {
    if (event.target === fileInput) {
      fileValidation.handleSelectionChange();
      return;
    }

    persistState();
    updateSummary(collectFormData());
  });

  nextButton.addEventListener('click', handlePrimaryAction);

  backButton.addEventListener('click', () => {
    if (state.getSnapshot().currentStep === 1 || isSending) return;
    state.goBack();
    renderState();
    persistState();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handlePrimaryAction();
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;

    if (event.key === 'Escape' && !isSending) {
      event.preventDefault();
      modalController.close();
      return;
    }

    modalController.trapFocus(event);
  });
};

export const initAllProjectRequestWizards = () => {
  document.querySelectorAll('[data-project-wizard-root]').forEach((root) => initProjectRequestWizard(root));
};
