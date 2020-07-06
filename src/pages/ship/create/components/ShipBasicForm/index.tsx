import React, { useEffect } from 'react';
import IShip, { ShipFieldLabels as fieldLabels } from '@/interfaces/IShip';
import styles from './index.less';
import { useRequest } from '@umijs/hooks';
import { Form, Select, Row, Col, Button, Card, Input, Divider, DatePicker } from 'antd';
import { ShipCreateStep } from '@/pages/ship/create/types';
import { listShipMaterial, listShipTypes } from '@/services/ship';

interface ShipBasicFormProps {
  ship: Partial<IShip>;
  currentStep: ShipCreateStep;
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
}

const ShipBasicForm: React.FC<ShipBasicFormProps> = ({ ship, switchToStep, currentStep }) => {
  const [form] = Form.useForm();

  const onValidateForm = async () => {
    try {
      let values = await form.validateFields();
      switchToStep(ShipCreateStep.Machine, values);
    } catch (e) {
      console.error(e);
    }
  };

  const { data: shipTypes } = useRequest(listShipTypes, {
    manual: false,
    cacheKey: 'ship_types',
  });

  const { data: shipMaterials } = useRequest(listShipMaterial, {
    manual: false,
    cacheKey: 'ship_material',
  });

  useEffect(() => {
    if (ship && currentStep == ShipCreateStep.Basic) {
      form.setFieldsValue(ship);
    }
  }, [currentStep, ship]);

  return (
    <>
      <Card bordered={false}>
        <Form form={form} layout="vertical" className={styles.stepForm}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.name}
                name="name"
                rules={[{ required: true, message: '请输入船舶名称' }]}
              >
                <Input placeholder="请输入船舶名称" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels.carrierIdentifier}
                name="carrierIdentifier"
                rules={[{ required: true, message: '请输入船舶识别号' }]}
              >
                <Input placeholder="请输入船舶识别号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.owner} name="owner">
                <Input placeholder="请输入船舶所有人" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.type} name="typeId">
                <Select placeholder="请选择船舶类型">
                  {shipTypes &&
                    shipTypes.map(val => (
                      <Select.Option value={val.id} key={val.id}>
                        {val.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.shareInfo} name="shareInfo">
                <Input placeholder="请输入船舶共有情况" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.registerIdentifier} name="registerIdentifier">
                <Input placeholder="请输入船舶初次登记号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.examineIdentifier} name="examineIdentifier">
                <Input placeholder="请输入船舶船检登记号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.material} name="materialId">
                <Select placeholder="请选择船舶材质" style={{ width: '100%' }}>
                  {shipMaterials &&
                    shipMaterials.map(val => (
                      <Select.Option value={val.id} key={val.id}>
                        {val.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.harbor} name="harbor">
                <Input placeholder="请输入船籍港" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.formerName} name="formerName">
                <Input placeholder="请输入曾用名" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.buildAt} name="buildAt">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请输入建造完工日期"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.assembleAt} name="assembleAt">
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请输入安放龙骨日期"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0 24px' }} />

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.grossTone} name="grossTone">
                <Input placeholder="请输入船舶总吨" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.netTone} name="netTone">
                <Input placeholder="请输入船舶净吨" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.length} name="length">
                <Input placeholder="请输入船舶总长" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.width} name="width">
                <Input placeholder="请输入船舶总宽" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.depth} name="depth">
                <Input placeholder="请输入船舶型深" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.height} name="height">
                <Input placeholder="请输入船舶船高" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card bordered={false} style={{ marginTop: 24 }}>
        <Button type="primary" style={{ marginRight: 24, float: 'right' }} onClick={onValidateForm}>
          下一步
        </Button>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>船舶基本信息</h4>
          <p>如果需要，这里可以放一些关于录入船舶的常见问题说明</p>
        </div>
      </Card>
    </>
  );
};

export default ShipBasicForm;
