import React, { useState, useEffect } from 'react';
import { Steps, Card, Row, Col, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { listShipCategory } from '@/services/shipService';
import { useRequest } from '@umijs/hooks';
import useStep from '@/hooks/useStep';
import ShipBasicForm from '@/pages/ship/create/ShipBasicForm';
import { IShip } from '@/interfaces/IShip';
import ShipMachineForm from '@/pages/ship/create/ShipMachineForm';

interface CreateShipProps {}

const steps = [
  { id: 'basic', index: 0 },
  { id: 'machine', index: 1 },
  { id: 'payload', index: 2 },
  { id: 'license', index: 3 },
  { id: 'sailor', index: 4 },
  { id: 'submit', index: 5 },
];

const CreateShip: React.FC<CreateShipProps> = props => {
  const { data: shipCategoryType } = useRequest(listShipCategory, {
    manual: false,
    cacheKey: 'ship_category_type',
  });

  const [shipForm, setShipForm] = useState<Partial<IShip>>({
    name: 'nameX',
    carrierIdentifier: '12122',
    shipTypeId: 1009002,
    shipMaterialTypeId: 1010001,
  });

  const { step, navigation } = useStep({ steps, initialStep: 0 });

  const [stepComponent, updateStepComponent] = useState<React.ReactNode>(null);

  const onUpdate = (ship: Partial<IShip>) => {
    let newShip = { ...shipForm, ...ship };
    setShipForm(newShip);
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
        component = (
          <ShipMachineForm
            ship={shipForm}
            onUpdate={onUpdate}
            shipCategoryType={shipCategoryType}
            navigation={navigation}
          />
        );
        break;
      case 'payload':
        break;
      case 'license':
        break;

      case 'sailor':
        break;
      case 'submit':
        break;
    }
    updateStepComponent(component);
  }, [step, shipCategoryType]);

  return (
    <PageHeaderWrapper title="录入船舶信息">
      <Card bordered={false}>
        <Row>
          <Col flex="200px" style={{ borderRight: '1px solid #f0f0f0' }}>
            <Steps size="small" current={step.index} style={{ height: 320 }} direction={'vertical'}>
              <Steps.Step title="基本信息" />
              <Steps.Step title="船机信息" />
              <Steps.Step title="载重吨信息" />
              <Steps.Step title="证书信息" />
              <Steps.Step title="船员信息" />
              <Steps.Step title="完成" />
            </Steps>
            <Divider type="vertical" />
          </Col>
          <Col flex="auto">{stepComponent}</Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default CreateShip;
