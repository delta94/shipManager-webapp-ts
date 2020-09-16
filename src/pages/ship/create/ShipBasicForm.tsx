import React, { useEffect } from 'react';
import styles from './style.less';
import { Form, Select, Row, Col, Button, Card, Input, Divider, DatePicker, InputNumber } from 'antd';
import { ShipKeyMap } from '@/services/shipService';
import { IShip } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';

interface ShipBasicFormProps {
  ship: Partial<IShip>;
  navigation: NavigationProps;
  shipCategoryType?: Record<ICategory, ICommonOptionType[]>;
  onUpdate(ship: Partial<IShip>): void;
}

const ShipBasicForm: React.FC<ShipBasicFormProps> = ({ ship, shipCategoryType, navigation, onUpdate }) => {
  const [form] = Form.useForm();

  const onValidateForm = () => {
    form.validateFields().then(value => {
      onUpdate(value);
      navigation.next();
    });
  };

  const onResetForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (ship) {
      form.setFieldsValue({ ...ship });
    }
  }, [ship]);

  return (
    <>
      <Card bordered={false}>
        <Form form={form} layout="vertical" className={styles.stepForm}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.name} name="name" rules={[{ required: true, message: '请输入船舶名称' }]}>
                <Input placeholder="请输入船舶名称" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={ShipKeyMap.carrierIdentifier}
                name="carrierIdentifier"
                rules={[{ required: true, message: '请输入船舶识别号' }]}
              >
                <Input placeholder="请输入船舶识别号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.owner} name="owner">
                <Input placeholder="请输入船舶所有人" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={ShipKeyMap.shipTypeName}
                name="shipTypeId"
                rules={[{ required: true, message: '请选择船舶类型' }]}
              >
                <Select placeholder="请选择船舶类型">
                  {shipCategoryType?.ShipType &&
                    shipCategoryType.ShipType.map(val => (
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
              <Form.Item label={ShipKeyMap.shareInfo} name="shareInfo">
                <Input placeholder="请输入船舶共有情况" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.firstRegisterIdentifier} name="firstRegisterIdentifier">
                <Input placeholder="请输入船舶初次登记号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.registerIdentifier} name="registerIdentifier">
                <Input placeholder="请输入船舶登记号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.examineIdentifier} name="examineIdentifier">
                <Input placeholder="请输入船舶船检登记号" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={ShipKeyMap.shipMaterialTypeName}
                name="shipMaterialTypeId"
                rules={[{ required: true, message: '请选择船舶材质' }]}
              >
                <Select placeholder="请选择船舶材质" style={{ width: '100%' }}>
                  {shipCategoryType?.ShipMaterialType &&
                    shipCategoryType.ShipMaterialType.map(val => (
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
              <Form.Item label={ShipKeyMap.harbor} name="harbor">
                <Input placeholder="请输入船籍港" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.buildIn} name="buildIn">
                <Input placeholder="请输入船舶建造厂" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.formerName} name="formerName">
                <Input placeholder="请输入曾用名" />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.buildAt} name="buildAt">
                <DatePicker format="YYYY-MM-DD" placeholder="请输入建造完工日期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.assembleAt} name="assembleAt">
                <DatePicker format="YYYY-MM-DD" placeholder="请输入安放龙骨日期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0 24px' }} />

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.grossTone} name="grossTone">
                <Input placeholder="请输入船舶总吨" />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.netTone} name="netTone">
                <Input placeholder="请输入船舶净吨" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.length} name="length">
                <InputNumber placeholder="请输入船舶总长" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.width} name="width">
                <InputNumber placeholder="请输入船舶总宽" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.height} name="height">
                <InputNumber placeholder="请输入船舶船高" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={ShipKeyMap.depth} name="depth">
                <InputNumber placeholder="请输入船舶型深" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Divider type={'horizontal'} />

      <Card bordered={false}>
        <Button type="primary" style={{ marginRight: 12, float: 'right' }} onClick={onValidateForm}>
          下一步
        </Button>
        <Button type="default" style={{ marginRight: 12, float: 'right' }} onClick={onResetForm}>
          重置
        </Button>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>船舶基本信息</h4>
          <p>部分信息可以放到之后作为补充录入</p>
        </div>
      </Card>
    </>
  );
};

export default ShipBasicForm;
