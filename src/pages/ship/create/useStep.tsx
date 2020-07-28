import React, { useState, useEffect } from 'react';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';

interface IUseStepDeps {
  category: Record<ICategory, ICommonOptionType[]>;
}

interface IUseStepExport {
  current: number;
  stepComponent: React.ReactNode;
}

export default function useStep(option: IUseStepDeps): IUseStepExport {
  const [current, setCurrent] = useState(0);
  const stepComponent = useState<React.ReactNode>(null);

  useEffect(() => {
    //todo
  }, []);

  return {
    current,
    stepComponent,
  };
}
