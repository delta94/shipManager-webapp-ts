import React, { useState, useMemo, useCallback } from 'react';
import { Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';

import ShipBasicForm from './components/ShipBasicForm';
import ShipPayloadForm from './components/ShipPayloadForm';
import ShipCertForm from './components/ShipCertForm';
import ShipMachineForm from './components/ShipMachineForm';
import ShipSailorForm from './components/ShipSailorForm';
import ShipResultPage from './components/ShipResultPage';
import IShip from '@/interfaces/IShip';
import { ShipCreateStep } from './types';

const ShipCreate: React.FC = () => {
  const [currentStep, updateCurrentStep] = useState(ShipCreateStep.Machine);
  const [ship, updateShip] = useState<Partial<IShip>>({});

  const switchToStep = (index: ShipCreateStep, shipData: Partial<IShip>) => {
    updateShip({ ...ship, ...shipData });
    updateCurrentStep(index);
  };

  const resetStepForm = useCallback(() => {
    updateShip({});
    updateCurrentStep(ShipCreateStep.Basic);
  }, []);

  const onCreateShip = useCallback(() => {}, []);

  const stepComponent = useMemo(() => {
    if (currentStep === ShipCreateStep.Basic) {
      return <ShipBasicForm ship={ship} currentStep={currentStep} switchToStep={switchToStep} />;
    } else if (currentStep === ShipCreateStep.Machine) {
      return <ShipMachineForm ship={ship} currentStep={currentStep} switchToStep={switchToStep} />;
    } else if (currentStep === ShipCreateStep.Payload) {
      return <ShipPayloadForm ship={ship} currentStep={currentStep} switchToStep={switchToStep} />;
    } else if (currentStep === ShipCreateStep.Certificate) {
      return <ShipCertForm ship={ship} currentStep={currentStep} switchToStep={switchToStep} />;
    } else if (currentStep === ShipCreateStep.Sailor) {
      return (
        <ShipSailorForm
          ship={ship}
          currentStep={currentStep}
          switchToStep={switchToStep}
          onCreateShip={onCreateShip}
        />
      );
    } else if (currentStep === ShipCreateStep.Result) {
      return <ShipResultPage ship={ship} currentStep={currentStep} onReset={resetStepForm} />;
    }
    return null;
  }, [currentStep, ship]);

  return (
    <PageHeaderWrapper content="按表单提示填入相应船舶信息">
      <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps}>
            <Steps.Step title="基本信息" />
            <Steps.Step title="船机信息" />
            <Steps.Step title="载重吨信息" />
            <Steps.Step title="证书信息" />
            <Steps.Step title="船员信息" />
            <Steps.Step title="完成" />
          </Steps>
        </>
      </Card>
      <div style={{ marginTop: 24 }}>{stepComponent}</div>
    </PageHeaderWrapper>
  );
};

export default ShipCreate;
