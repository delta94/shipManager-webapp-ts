import React, { useState, useEffect, useCallback } from 'react';
import Step1 from '../editManagerStep1';
import Step2 from '../editManagerStep2';
import Step3 from '../editManagerStep3';
import { IManager, IManagerCertType, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import { formatUploadFileToOSSFiles } from '@/utils/parser';

interface IUseStepDep {
  manager?: IManager;
  loading: boolean;
  dutyTypes?: IManagerDutyType[];
  positionTypes?: IManagerPositionType[];
  issueDepartmentTypes?: IssueDepartmentType[];
  managerCertTypes?: IManagerCertType[];
  onSave(manager: IManager): Promise<IManager>;
}

interface IUseStepExport {
  currentStep: number;
  stepComponent?: React.ReactNode;
}

export default function useStep(option: IUseStepDep): IUseStepExport {
  const [stepComponent, setStepComponent] = useState<React.ReactNode>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [managerForm, updateManagerForm] = useState<IManager>();

  useEffect(() => {
    if (option.manager) {
      updateManagerForm({ ...option.manager });
    }
  }, [option.manager]);

  const onNextStep = useCallback(
    (manager: IManager) => {
      // last step
      if (currentStep == 1) {
        if (manager.managerCerts) {
          manager.managerCerts = manager.managerCerts.map(item => {
            formatUploadFileToOSSFiles(item);
            if (item.id && item.id.toString().startsWith('new_')) {
              delete item.id;
            }
            return item;
          });
        }
        option.onSave(manager).then(_ => {
          setCurrentStep(currentStep + 1);
          updateManagerForm(manager);
        });
      } else {
        updateManagerForm(manager);
        setCurrentStep(currentStep + 1);
      }
    },
    [currentStep],
  );

  const onPrevStep = useCallback(
    manager => {
      setCurrentStep(currentStep - 1);
      updateManagerForm(manager);
    },
    [currentStep],
  );

  useEffect(() => {
    let stepComponent = null;
    let current = currentStep || 0;
    switch (current) {
      case 0:
        stepComponent = (
          <Step1
            onNext={onNextStep}
            manager={managerForm}
            positionTypes={option.positionTypes}
            dutyTypes={option.dutyTypes}
          />
        );
        break;
      case 1:
        stepComponent = (
          <Step2
            loading={option.loading}
            onNext={onNextStep}
            onPrev={onPrevStep}
            manager={managerForm}
            managerCertTypes={option.managerCertTypes}
            issueDepartmentTypes={option.issueDepartmentTypes}
          />
        );
        break;
      case 2:
        stepComponent = <Step3 manager={managerForm} />;
        break;
    }
    setStepComponent(stepComponent);
  }, [currentStep, managerForm, option.loading]);

  return {
    currentStep,
    stepComponent,
  };
}
