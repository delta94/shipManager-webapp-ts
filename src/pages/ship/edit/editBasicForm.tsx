import React, { useEffect } from 'react';
import { Input, Form, message, Button, Select, Row, Col, DatePicker } from 'antd';
import { IShip, IShipMaterialType, IShipType } from '@/interfaces/IShip';
import { ShipKeyMap as ShipKey, updateShip } from '@/services/shipService';
import { useRequest } from 'umi';
import {dateFormatter, dateFormatterToString} from '@/utils/parser';

interface EditBasicFormProps {
  ship: Partial<IShip>;
  onUpdate: Function;
  onCancel: Function;
  shipTypes: IShipType[];
  shipMaterialTypes: IShipMaterialType[];
}

const EditBasicForm: React.FC<EditBasicFormProps> = ({ ship, onUpdate, onCancel, shipMaterialTypes, shipTypes }) => {
  const [form] = Form.useForm();

  const { loading, run: updateShipInfo } = useRequest(updateShip, {
    manual: true,
    onSuccess() {
      message.success('船舶信息已更新');
      onUpdate();
    },
    onError() {
      message.error('船舶信息更新失败');
    },
  });

  useEffect(() => {
    if (ship?.id) {
      let values = dateFormatter({ ...ship });
      form.setFieldsValue(values);
    }
  }, [ship]);

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: any) => {
    values = dateFormatterToString(values);
    updateShipInfo(values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="name"
            label={ShipKey.name}
            rules={[
              {
                required: true,
                message: `请输入 ${ShipKey.name}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.name}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="shipTypeId"
            label={ShipKey.shipTypeName}
            rules={[
              {
                required: true,
                message: `请输入 ${ShipKey.shipTypeName}`,
              },
            ]}
          >
            <Select>
              {shipTypes &&
                shipTypes.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="shipMaterialTypeId"
            label={ShipKey.shipMaterialTypeName}
            rules={[
              {
                required: true,
                message: `请输入 ${ShipKey.shipMaterialTypeName}`,
              },
            ]}
          >
            <Select>
              {shipMaterialTypes &&
                shipMaterialTypes.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="examineIdentifier"
            label={ShipKey.examineIdentifier}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.examineIdentifier}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.examineIdentifier}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="registerIdentifier"
            label={ShipKey.registerIdentifier}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.registerIdentifier}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.registerIdentifier}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="firstRegisterIdentifier"
            label={ShipKey.firstRegisterIdentifier}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.firstRegisterIdentifier}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.firstRegisterIdentifier}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="formerName"
            label={ShipKey.formerName}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.formerName}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.formerName}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="owner"
            label={ShipKey.owner}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.owner}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.owner}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="shareInfo"
            label={ShipKey.shareInfo}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.shareInfo}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.shareInfo}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="buildIn"
            label={ShipKey.buildIn}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.buildIn}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.buildIn}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="harbor"
            label={ShipKey.harbor}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.harbor}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.harbor}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="buildAt"
            label={ShipKey.buildAt}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.buildAt}`,
              },
            ]}
          >
            <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="assembleAt"
            label={ShipKey.assembleAt}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.assembleAt}`,
              },
            ]}
          >
            <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="remark"
            label={ShipKey.remark}
            rules={[
              {
                required: false,
                message: `请输入 ${ShipKey.remark}`,
              },
            ]}
          >
            <Input placeholder={`请输入 ${ShipKey.remark}`} />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ height: 24 }} />

      <div className="g-ant-modal-footer">
        <Button style={{ marginRight: 12 }} onClick={onReset}>
          取消
        </Button>
        <Button type="primary" loading={loading} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditBasicForm;
