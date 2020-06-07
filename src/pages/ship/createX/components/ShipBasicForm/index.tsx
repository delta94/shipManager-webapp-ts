import * as React from 'react';
import { Card, Col, Row, Form, Select, DatePicker, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import IShip, {
  IShipBusinessArea,
  IShipMaterial,
  IShipType,
  ShipFieldLabels as fieldLabels,
} from '@/interfaces/IShip';
import styles from '../../style.less';
import { ShipCreateStep } from '@/pages/ship/create';
import moment from 'moment';

const { Option } = Select;

interface ShipBasicProps extends FormComponentProps {
  ship: Partial<IShip>;
  types: IShipType[];
  materials: IShipMaterial[];
  businessAreas: IShipBusinessArea[];
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
}

class ShipBasicForm extends React.Component<ShipBasicProps> {
  handleNext = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) {
        message.warn('请填写必要字段信息');
      } else {
        this.props.switchToStep(ShipCreateStep.Machine, values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      types,
      materials,
      ship,
    } = this.props;

    return (
      <Card title="基本信息" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.name}>
              {getFieldDecorator('name', {
                initialValue: ship.name,
                rules: [{ required: true, message: '请输入船舶名称' }],
              })(<Input placeholder="请输入船舶名称" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.carrierIdentifier}>
              {getFieldDecorator('carrierIdentifier', {
                initialValue: ship.carrierIdentifier,
                rules: [{ required: true, message: '请输入船舶识别号' }],
              })(<Input placeholder="请输入船舶识别号" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.owner}>
              {getFieldDecorator('owner', {
                initialValue: ship.owner,
                rules: [{ required: true, message: '请输入船舶所有人' }],
              })(<Input placeholder="请输入船舶所有人" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.type}>
              {getFieldDecorator('typeId', {
                initialValue: ship.typeId,
                rules: [{ required: true, message: '请选择船舶类型' }],
              })(
                <Select placeholder="请选择船舶类型" style={{ width: '100%' }}>
                  {types &&
                    types.map(val => (
                      <Option value={val.id} key={val.id}>
                        {val.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.shareInfo}>
              {getFieldDecorator('shareInfo', {
                initialValue: ship.shareInfo,
                rules: [{ required: true, message: '请输入船舶共有情况' }],
              })(<Input placeholder="请输入船舶共有情况" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.registerIdentifier}>
              {getFieldDecorator('registerIdentifier', {
                initialValue: ship.registerIdentifier,
                rules: [{ required: true, message: '请输入船舶初次登记号' }],
              })(<Input placeholder="请输入船舶初次登记号" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.examineIdentifier}>
              {getFieldDecorator('examineIdentifier', {
                initialValue: ship.examineIdentifier,
                rules: [{ required: true, message: '请输入船舶船检登记号' }],
              })(<Input placeholder="请输入船舶船检登记号" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.material}>
              {getFieldDecorator('materialId', {
                initialValue: ship.materialId,
                rules: [{ required: true, message: '请选择船舶材质' }],
              })(
                <Select placeholder="请选择船舶材质" style={{ width: '100%' }}>
                  {materials &&
                    materials.map(val => (
                      <Option value={val.id} key={val.id}>
                        {val.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.harbor}>
              {getFieldDecorator('harbor', {
                initialValue: ship.harbor,
                rules: [{ required: true, message: '请输入船籍港' }],
              })(<Input placeholder="请输入船籍港" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.formerName}>
              {getFieldDecorator('formerName', {
                initialValue: ship.formerName,
                rules: [{ required: false, message: '请输入曾用名' }],
              })(<Input placeholder="请输入曾用名" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.buildAt}>
              {getFieldDecorator('buildAt', {
                initialValue: ship.buildAt ? moment(ship.buildAt) : null,
                rules: [{ required: true, type: 'object', message: '请输入建造完工日期' }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请输入建造完工日期"
                  style={{ width: '100%' }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.assembleAt}>
              {getFieldDecorator('assembleAt', {
                initialValue: ship.assembleAt ? moment(ship.assembleAt) : null,
                rules: [{ required: true, type: 'object', message: '请输入安放龙骨日期' }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="请输入安放龙骨日期"
                  style={{ width: '100%' }}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.grossTone}>
              {getFieldDecorator('grossTone', {
                initialValue: ship.grossTone,
                rules: [{ required: true, message: '请输入船舶总吨' }],
              })(<Input placeholder="请输入船舶总吨" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.netTone}>
              {getFieldDecorator('netTone', {
                initialValue: ship.netTone,
                rules: [{ required: true, message: '请输入船舶净吨' }],
              })(<Input placeholder="请输入船舶净吨" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.length}>
              {getFieldDecorator('length', {
                initialValue: ship.length,
                rules: [{ required: true, message: '请输入船舶总长' }],
              })(<Input placeholder="请输入船舶总长" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.width}>
              {getFieldDecorator('width', {
                initialValue: ship.width,
                rules: [{ required: true, message: '请输入船舶总宽' }],
              })(<Input placeholder="请输入船舶总宽" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.depth}>
              {getFieldDecorator('depth', {
                initialValue: ship.depth,
                rules: [{ required: true, message: '请输入船舶型深' }],
              })(<Input placeholder="请输入船舶型深" />)}
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={fieldLabels.height}>
              {getFieldDecorator('height', {
                initialValue: ship.height,
                rules: [{ required: true, message: '请输入船舶船高' }],
              })(<Input placeholder="请输入船舶船高" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Button type="primary" onClick={this.handleNext} style={{ float: 'right' }}>
            下一步
          </Button>
        </Row>
      </Card>
    );
  }
}

export default Form.create<ShipBasicProps>()(ShipBasicForm);
