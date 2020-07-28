import React, { useState, useEffect, useCallback } from 'react';
import Step1 from '../editSailorStep1';
import Step2 from '../editSailorStep2';
import Step3 from '../editSailorStep3';
import { ISailor, ISailorCertType, ISailorDutyType } from '@/interfaces/ISailor';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import { formatUploadFileToOSSFiles } from '@/utils/parser';
import { useRequest } from '@umijs/hooks';
import { infoSailor } from '@/services/sailorService';
import {listShipMeta} from "@/services/shipService";

interface IUseStepDep {
  sailor?: ISailor;
  loading: boolean;
  dutyTypes?: ISailorDutyType[];
  issueDepartmentTypes?: IssueDepartmentType[];
  sailorCertTypes?: ISailorCertType[];
  onSave(sailor: ISailor): Promise<ISailor>;
}

interface IUseStepExport {
  currentStep: number;
  stepComponent?: React.ReactNode;
}

export default function useStep(option: IUseStepDep): IUseStepExport {
  const [stepComponent, setStepComponent] = useState<React.ReactNode>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sailorForm, updateSailorForm] = useState<ISailor>();

  const { run: getSailorInfo } = useRequest(infoSailor, {
    manual: true,
    onSuccess(data) {
      updateSailorForm({
        ...data,
      });
    },
  });

  const { data: shipMeta } = useRequest(listShipMeta, {
    manual: false,
    cacheKey: "ship_meta"
  });

  useEffect(() => {
    if (option.sailor) {
      updateSailorForm({ ...option.sailor });
      if (option.sailor.id) {
        getSailorInfo(option.sailor.id);
      }
    }
  }, [option.sailor]);

  const onNextStep = useCallback(
    (sailor: ISailor) => {
      // last step
      if (currentStep == 1) {
        if (sailor.sailorCerts) {
          sailor.sailorCerts = sailor.sailorCerts.map(item => {
            formatUploadFileToOSSFiles(item);
            if (item.id && item.id.toString().startsWith('new_')) {
              delete item.id;
            }
            return item;
          });
        }
        option.onSave(sailor).then(_ => {
          setCurrentStep(currentStep + 1);
          updateSailorForm(sailor);
        });
      } else {
        updateSailorForm(sailor);
        setCurrentStep(currentStep + 1);
      }
    },
    [currentStep],
  );

  const onPrevStep = useCallback(
    sailor => {
      setCurrentStep(currentStep - 1);
      updateSailorForm(sailor);
    },
    [currentStep],
  );

  useEffect(() => {
    let stepComponent = null;
    let current = currentStep || 0;
    switch (current) {
      case 0:
        stepComponent = <Step1 onNext={onNextStep}
                               sailor={sailorForm}
                               shipMeta={shipMeta}
                               dutyTypes={option.dutyTypes} />;
        break;
      case 1:
        stepComponent = (
          <Step2
            loading={option.loading}
            onNext={onNextStep}
            onPrev={onPrevStep}
            sailor={sailorForm}
            sailorCertTypes={option.sailorCertTypes}
            issueDepartmentTypes={option.issueDepartmentTypes}
          />
        );
        break;
      case 2:
        stepComponent = <Step3 sailor={sailorForm} />;
        break;
    }
    setStepComponent(stepComponent);
  }, [currentStep, sailorForm, option.loading]);

  return {
    currentStep,
    stepComponent,
  };
}
