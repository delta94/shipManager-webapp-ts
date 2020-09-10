import React from 'react';
import { Steps } from 'antd';
import { IManager, IManagerCertType, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import styles from './styles/step.less';
import useStep from './useHooks/useStep';
import { useRequest } from 'umi';
import { createManager, updateManager } from '@/services/managerService';

interface EditManagerFormProps {
  onUpdate: Function;
  onCancel: Function;
  manager?: IManager;
  dutyTypes?: IManagerDutyType[];
  positionTypes?: IManagerPositionType[];
  issueDepartmentTypes?: IssueDepartmentType[];
  managerCertTypes?: IManagerCertType[];
}

const upsertManager = (manager: IManager): Promise<IManager> => {
  return manager.id ? updateManager(manager) : createManager(manager);
};

const EditManagerForm: React.FC<EditManagerFormProps> = (props) => {
  const { run: performUpdateManager, loading } = useRequest(upsertManager, {
    manual: true,
    onSuccess() {
      props.onUpdate && props.onUpdate();
    },
  });

  const { currentStep, stepComponent } = useStep({
    positionTypes: props.positionTypes,
    dutyTypes: props.dutyTypes,
    issueDepartmentTypes: props.issueDepartmentTypes,
    managerCertTypes: props.managerCertTypes,
    manager: props.manager,
    loading: loading,
    onSave: performUpdateManager,
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

export default EditManagerForm;
