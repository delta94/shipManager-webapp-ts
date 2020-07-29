import React, { useEffect, useState } from 'react';
import { ShipPayloadKeyMap, upsertShipPayload } from '@/services/shipService';
import { message, Form, InputNumber, Input, Button, Select } from 'antd';
import { IShipBusinessAreaType, IShipPayload } from '@/interfaces/IShip';
import { useRequest } from '@umijs/hooks';

interface EditPayloadFormProps {
  payload?: Partial<IShipPayload>;
  onUpdate: Function;
  onCancel: Function;
  shipBusinessAreaType: IShipBusinessAreaType[];
}

const EditPayloadForm: React.FC<EditPayloadFormProps> = ({ onCancel, onUpdate, payload, shipBusinessAreaType }) => {
  const [form] = Form.useForm();
  const [areaTip, setAreaTip] = useState();

  const { loading, run: updateShipPayloadInfo } = useRequest(upsertShipPayload, {
    manual: true,
    onSuccess() {
      message.success('载量信息已更新');
      onUpdate();
    },
    onError() {
      message.error('载量信息更新失败');
    },
  });

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: any) => {
    updateShipPayloadInfo(values);
  };

  const onSelectArea = (value: any, item: any) => {
    setAreaTip(item.title || '');
  };

  useEffect(() => {
    if (payload?.id || payload?.shipId) {
      form.setFieldsValue(payload);
    }
  }, [payload]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6, offset: 1 }} wrapperCol={{ span: 10 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item label="shipId" name="shipId" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 12 }}
        name="shipBusinessAreaId"
        label={ShipPayloadKeyMap.shipBusinessAreaName}
        help={areaTip}
        rules={[
          {
            required: true,
            message: `请输入 ${ShipPayloadKeyMap.shipBusinessAreaName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ShipPayloadKeyMap.shipBusinessAreaName}`} onSelect={onSelectArea}>
          {shipBusinessAreaType?.map((item, index) => (
            <Select.Option value={item.id} key={index} title={item.remark}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="tone"
        label={ShipPayloadKeyMap.tone}
        rules={[
          {
            required: true,
            message: `请输入 ${ShipPayloadKeyMap.tone}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入 ${ShipPayloadKeyMap.tone}`} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="remark"
        label={ShipPayloadKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入 ${ShipPayloadKeyMap.remark}`,
          },
        ]}
      >
        <Input.TextArea placeholder={`请输入 ${ShipPayloadKeyMap.remark}`} autoSize={{ minRows: 3, maxRows: 5 }} />
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
