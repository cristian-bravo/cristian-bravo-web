interface RenderWizardStateOptions {
  stepTitles: string[];
  stepDescriptions: string[];
  counterTemplate: string;
  backLabel: string;
  nextLabel: string;
  finalSubmitLabel: string;
  isSending: boolean;
  currentStep: number;
  direction: 'forward' | 'backward';
  canAccessStep: (step: number) => boolean;
  stepCounter: HTMLElement;
  stepTitle: HTMLElement;
  stepDescription: HTMLElement;
  progressFill: HTMLElement;
  nextButton: HTMLButtonElement;
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
  finalSubmitLabel,
  isSending,
  currentStep,
  direction,
  canAccessStep,
  stepCounter,
  stepTitle,
  stepDescription,
  progressFill,
  nextButton,
  backButton,
  stepPanels,
  stepChips,
}: RenderWizardStateOptions) => {
  const isFinalStep = currentStep >= stepTitles.length;
  const primaryActionLabel = isFinalStep ? finalSubmitLabel : nextLabel;

  stepCounter.textContent = counterTemplate
    .replace('{current}', String(currentStep))
    .replace('{total}', String(stepTitles.length));
  stepTitle.textContent = stepTitles[currentStep - 1] || '';
  stepDescription.textContent = stepDescriptions[currentStep - 1] || '';
  progressFill.style.width = `${Math.round((currentStep / stepTitles.length) * 100)}%`;
  backButton.disabled = currentStep === 1 || isSending;
  nextButton.disabled = isSending;
  backButton.textContent = backLabel;
  nextButton.dataset.actionMode = isFinalStep ? 'submit' : 'next';
  nextButton.setAttribute('aria-label', primaryActionLabel);
  nextButton.querySelector<HTMLElement>('[data-next-button-label]')?.replaceChildren(primaryActionLabel);

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
