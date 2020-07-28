import React, { useEffect } from 'react';
import { InputNumber, Input, Form, message, Button } from 'antd';
import { IShip } from '@/interfaces/IShip';
import { ShipKeyMap as ShipKey, updateShip } from '@/services/shipService';
import { useRequest } from '@umijs/hooks';

interface EditMetricFormProps {
  ship: IShip;
  onUpdate: Function;
  onCancel: Function;
}

const EditMetricForm: React.FC<EditMetricFormProps> = ({ ship, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  const { loading, run: updateShipInfo } = useRequest(updateShip, {
    manual: true,
    onSuccess() {
      message.success('船体参数信息已更新');
      onUpdate();
    },
    onError() {
      message.error('船体参数信息更新失败');
    },
  });

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: any) => {
    updateShipInfo(values);
  };

  useEffect(() => {
    if (ship?.id) {
      form.setFieldsValue(ship);
    }
  }, [ship]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6, offset: 2 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="height"
        label={ShipKey.height}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.height}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.height}`} style={{ width: '90%' }}  />
      </Form.Item>

      <Form.Item
        name="width"
        label={ShipKey.width}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.width}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.width}`} style={{ width: '90%' }} />
      </Form.Item>

      <Form.Item
        name="length"
        label={ShipKey.length}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.length}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.length}`} style={{ width: '90%' }} />
      </Form.Item>

      <Form.Item
        name="depth"
        label={ShipKey.depth}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.depth}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.depth}`} style={{ width: '90%' }} />
      </Form.Item>

      <Form.Item
        name="grossTone"
        label={ShipKey.grossTone}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.grossTone}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.grossTone}`} style={{ width: '90%' }} />
      </Form.Item>

      <Form.Item
        name="netTone"
        label={ShipKey.netTone}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipKey.netTone}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipKey.netTone}`} style={{ width: '90%' }} />
      </Form.Item>

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

export default EditMetricForm;
