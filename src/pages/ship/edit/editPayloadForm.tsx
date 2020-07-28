import React, { useState, useEffect } from 'react';
import { ShipKeyMap as ShipKey, updateShip } from '@/services/shipService';
import { message, Form, InputNumber, Button } from 'antd';
import { Input } from 'antd/es';
import { IShipPayload } from '@/interfaces/IShip';
import { useRequest } from '@umijs/hooks';

interface EditPayloadFormProps {
  payload: IShipPayload;
  onUpdate: Function;
  onCancel: Function;
}

const EditPayloadForm: React.FC<EditPayloadFormProps> = ({ onCancel, onUpdate, payload }) => {
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
    if (payload?.id) {
      form.setFieldsValue(payload);
    }
  }, [payload]);

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
        <InputNumber placeholder={`请输入 ${ShipKey.height}`} style={{ width: '90%' }} />
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

export default EditPayloadForm;
