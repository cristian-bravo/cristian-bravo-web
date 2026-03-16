interface RenderWizardStateOptions {
  stepTitles: string[];
  stepDescriptions: string[];
  counterTemplate: string;
  backLabel: string;
  nextLabel: string;
  isSending: boolean;
  currentStep: number;
  direction: 'forward' | 'backward';
  canAccessStep: (step: number) => boolean;
  stepCounter: HTMLElement;
  stepTitle: HTMLElement;
  stepDescription: HTMLElement;
  progressFill: HTMLElement;
  nextButton: HTMLButtonElement;
  submitButton: HTMLButtonElement;
  backButton: HTMLButtonElement;
  stepPanels: HTMLElement[];
  stepChips: HTMLButtonElement[];
}

export const renderWizardState = ({
  stepTitles,
  stepDescriptions,
  counterTemplate,
  backLabel,
  nextLabel,
  isSending,
  currentStep,
  direction,
  canAccessStep,
  stepCounter,
  stepTitle,
  stepDescription,
  progressFill,
  nextButton,
  submitButton,
  backButton,
  stepPanels,
  stepChips,
}: RenderWizardStateOptions) => {
  stepCounter.textContent = counterTemplate
    .replace('{current}', String(currentStep))
    .replace('{total}', String(stepTitles.length));
  stepTitle.textContent = stepTitles[currentStep - 1] || '';
  stepDescription.textContent = stepDescriptions[currentStep - 1] || '';
  progressFill.style.width = `${Math.round((currentStep / stepTitles.length) * 100)}%`;
  nextButton.hidden = currentStep >= stepTitles.length;
  submitButton.hidden = currentStep < stepTitles.length;
  backButton.disabled = currentStep === 1 || isSending;
  submitButton.disabled = isSending;
  backButton.textContent = backLabel;
  nextButton.querySelector('span:not([aria-hidden])')?.replaceChildren(nextLabel);

  stepPanels.forEach((panel) => {
    const panelStep = Number(panel.dataset.stepPanel);
    const isActive = panelStep === currentStep;
    panel.hidden = !isActive;
    panel.classList.remove('is-forward', 'is-backward');
    if (isActive) {
      panel.classList.add(direction === 'backward' ? 'is-backward' : 'is-forward');
    }
  });

  stepChips.forEach((chip) => {
    const chipStep = Number(chip.dataset.stepChip);
    chip.disabled = !canAccessStep(chipStep) || isSending;
    chip.setAttribute('aria-selected', String(chipStep === currentStep));
    chip.classList.toggle('is-active', chipStep === currentStep);
    chip.classList.toggle('is-completed', chipStep < currentStep);
  });
};
