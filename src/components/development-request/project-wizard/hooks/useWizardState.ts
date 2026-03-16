import type { WizardStepDirection } from '../types/projectRequest.types';

interface WizardStateSnapshot {
  currentStep: number;
  furthestStep: number;
  direction: WizardStepDirection;
}

export const useWizardState = (totalSteps: number) => {
  let snapshot: WizardStateSnapshot = {
    currentStep: 1,
    furthestStep: 1,
    direction: 'forward',
  };

  const clampStep = (step: number) => Math.min(Math.max(step, 1), totalSteps);

  return {
    getSnapshot: () => snapshot,
    canAccessStep: (step: number) => step <= snapshot.furthestStep,
    setStep: (step: number) => {
      const nextStep = clampStep(step);

      snapshot = {
        currentStep: nextStep,
        furthestStep: Math.max(snapshot.furthestStep, nextStep),
        direction: nextStep > snapshot.currentStep ? 'forward' : 'backward',
      };
    },
    goNext: () => {
      const nextStep = clampStep(snapshot.currentStep + 1);

      snapshot = {
        currentStep: nextStep,
        furthestStep: Math.max(snapshot.furthestStep, nextStep),
        direction: 'forward',
      };
    },
    goBack: () => {
      snapshot = {
        ...snapshot,
        currentStep: clampStep(snapshot.currentStep - 1),
        direction: 'backward',
      };
    },
    restore: (currentStep: number, furthestStep: number) => {
      const normalizedStep = clampStep(currentStep);

      snapshot = {
        currentStep: normalizedStep,
        furthestStep: clampStep(Math.max(furthestStep, normalizedStep)),
        direction: 'forward',
      };
    },
    reset: () => {
      snapshot = {
        currentStep: 1,
        furthestStep: 1,
        direction: 'forward',
      };
    },
  };
};
