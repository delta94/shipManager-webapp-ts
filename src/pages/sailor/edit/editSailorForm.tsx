import React from 'react';
import { Steps } from 'antd';
import { ISailor, ISailorCertType, ISailorDutyType } from '@/interfaces/ISailor';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import styles from './styles/step.less';
import useStep from './useHooks/useStep';
import { useRequest } from '@umijs/hooks';
import { createSailor, updateSailor } from '@/services/sailorService';

interface EditSailorFormProps {
  onUpdate: Function;
  onCancel: Function;
  sailor?: ISailor;
  dutyTypes?: ISailorDutyType[];
  issueDepartmentTypes?: IssueDepartmentType[];
  sailorCertTypes?: ISailorCertType[];
}

const upsertSailor = (sailor: ISailor): Promise<ISailor> => {
  return sailor.id ? updateSailor(sailor) : createSailor(sailor);
};

const EditSailorForm: React.FC<EditSailorFormProps> = props => {

  const { run: performUpdateSailor, loading } = useRequest(upsertSailor, {
    manual: true,
    onSuccess() {
      props.onUpdate && props.onUpdate();
    },
  });

  const { currentStep, stepComponent } = useStep({
    dutyTypes: props.dutyTypes,
    issueDepartmentTypes: props.issueDepartmentTypes,
    sailorCertTypes: props.sailorCertTypes,
    sailor: props.sailor,
    loading: loading,
    onSave: performUpdateSailor,
  });

  return (
    <div>
      {currentStep != 2 && (
        <Steps current={currentStep} className={styles.steps}>
          <Steps.Step title="基础信息" />
          <Steps.Step title="证书信息" />
          <Steps.Step title="完成" />
        </Steps>
      )}
      {stepComponent}
    </div>
  );
};

export default EditSailorForm;
