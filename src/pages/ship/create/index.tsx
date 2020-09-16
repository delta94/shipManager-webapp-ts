import React, { useState, useEffect } from 'react';
import { Steps, Card, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addShip, listShipCategory } from '@/services/shipService';
import { useRequest } from 'umi';
import useStep from '@/hooks/useStep';
import ShipBasicForm from '@/pages/ship/create/ShipBasicForm';
import { IShip, IShipPayload } from '@/interfaces/IShip';
import ShipMachineForm from '@/pages/ship/create/ShipMachineForm';
import ShipPayloadForm from '@/pages/ship/create/ShipPayloadForm';
import ShipLicenseForm from '@/pages/ship/create/ShipLicenseForm';
import ShipResult from '@/pages/ship/create/ShipResult';
import { parseM2CM, parseT2KG } from '@/utils/parser';

interface CreateShipProps {}

const steps = [
  { id: 'basic', index: 0 },
  { id: 'machine', index: 1 },
  { id: 'payload', index: 2 },
  { id: 'license', index: 3 },
  { id: 'sailor', index: 4 },
  { id: 'result', index: 5 },
];

const CreateShip: React.FC<CreateShipProps> = (props) => {
  const { data: shipCategoryType } = useRequest(listShipCategory, {
    manual: false,
    cacheKey: 'ship_category_type',
  });

  const { run: createShip } = useRequest(addShip, {
    manual: true,
    onSuccess() {
      navigation.next();
    },
    onError(err) {
      console.error(err);
    },
  });

  const [shipForm, setShipForm] = useState<Partial<IShip>>({});

  const { step, navigation } = useStep({ steps, initialStep: 0 });

  const [stepComponent, updateStepComponent] = useState<React.ReactNode>(null);

  const onUpdate = (ship: Partial<IShip>, save?: boolean) => {
    let newShip = { ...shipForm, ...ship };
    setShipForm(newShip);
    if (save) {
      let hideLoading = message.loading('正在创建船舶...');
      if (newShip.shipLicenses && newShip.shipLicenses.length > 0) {
        newShip.shipLicenses.forEach((item: any) => {
          item.id = undefined;
        });
      }
      if (newShip.shipPayloads && newShip.shipPayloads.length > 0) {
        newShip.shipPayloads.forEach((item: IShipPayload) => {
          // @ts-ignore
          item.id = undefined;
          item.tone = parseT2KG(item.tone);
        });
      }
      if (newShip.shipMachines && newShip.shipMachines.length > 0) {
        newShip.shipMachines.forEach((item: any) => {
          item.id = undefined;
        });
      }

      newShip.grossTone = parseT2KG(newShip.grossTone);
      newShip.netTone = parseT2KG(newShip.netTone);

      newShip.length = parseM2CM(newShip.width);
      newShip.width = parseM2CM(newShip.width);
      newShip.height = parseM2CM(newShip.height);
      newShip.depth = parseM2CM(newShip.depth);

      createShip(newShip).then(() => {
        hideLoading();
      });
    }
  };

  const onReset = () => {
    setShipForm({});
    navigation && navigation.go?.(0);
  };

  useEffect(() => {
    let component: React.ReactNode = null;
    switch (step.id) {
      case 'basic':
        component = (
          <ShipBasicForm
            navigation={navigation}
            onUpdate={onUpdate}
            ship={shipForm}
            shipCategoryType={shipCategoryType}
          />
        );
        break;
      case 'machine':
        component = <ShipMachineForm ship={shipForm} onUpdate={onUpdate} navigation={navigation} />;
        break;
      case 'payload':
        component = (
          <ShipPayloadForm
            ship={shipForm}
            onUpdate={onUpdate}
            navigation={navigation}
            shipCategoryType={shipCategoryType}
          />
        );
        break;
      case 'license':
        component = (
          <ShipLicenseForm
            ship={shipForm}
            onUpdate={onUpdate}
            navigation={navigation}
            shipCategoryType={shipCategoryType}
          />
        );
        break;
      case 'result':
        component = <ShipResult ship={shipForm} navigation={navigation} onReset={onReset} />;
        break;
    }
    updateStepComponent(component);
  }, [step, shipCategoryType]);

  return (
    <PageHeaderWrapper title="录入船舶信息">
      <Card bordered style={{ marginBottom: 8 }}>
        <Steps size="small" current={step.index}>
          <Steps.Step title="基本信息" />
          <Steps.Step title="船机信息" />
          <Steps.Step title="载重吨信息" />
          <Steps.Step title="营运证信息" />
          <Steps.Step title="完成" />
        </Steps>
      </Card>
      <Card bordered={false}>
        <div>{stepComponent}</div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default CreateShip;
