import { useState } from 'react';

export interface NavigationProps {
  next: () => void;
  previous: () => void;
  go?: (step: number | string) => void;
}

interface UseStepType {
  id: string;
  index: number;
}

export interface UseStepParams {
  initialStep?: number;
  steps: UseStepType[];
}

export interface UseStepResponse {
  index: number;
  step: UseStepType;
  navigation: NavigationProps;
}

const getIndexById = (arr: Array<any>, matchId: number | string) => arr.findIndex(({ id }) => id === matchId);

export default function useStep(options: UseStepParams): UseStepResponse {
  let {
    initialStep = 0, // accept number or string (if string convert to index)
    steps: stepsProp,
  } = options;

  // Convert steps to an array if it is a number.
  const steps = typeof stepsProp === 'number' ? new Array(stepsProp).fill({}) : stepsProp;

  // Compute initialStepIndex in case an id is passed vs an index.
  const initialStepIndex = typeof initialStep === 'number' ? initialStep : getIndexById(steps, initialStep);

  // Setup state.
  const [index, setStep] = useState(initialStepIndex);

  const step = steps[index];

  const deltaSetStep = (delta = 1) => {
    setStep((index + steps.length + delta) % steps.length);
  };

  // Build navigation callback functions.
  const navigation = {
    next: () => deltaSetStep(1),
    previous: () => deltaSetStep(-1),
    go: (newStep: number | string) => {
      if (typeof newStep === 'number') {
        setStep(newStep);
      } else {
        const newStepId = getIndexById(steps, newStep);
        setStep(newStepId);
      }
    },
  } as NavigationProps;

  return {
    index,
    step,
    navigation,
  };
}
