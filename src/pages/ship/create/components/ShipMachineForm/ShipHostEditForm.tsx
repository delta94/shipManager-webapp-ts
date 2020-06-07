import React, { useCallback, useEffect } from 'react';
import { IShipHost, ShipHostLabels } from '@/interfaces/IShip';
import { Input, Form, Button, InputNumber } from 'antd';
import styles from './index.less';

interface ShipHostEditFormProps {
  current?: Partial<IShipHost>;
  onSubmit(data: Partial<IShipHost>): Promise<any>;
  onCancel(): void;
}

const ShipHostEditForm: React.FC<ShipHostEditFormProps> = ({ current, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const onResetForm = useCallback(() => {
    form.resetFields();
    onCancel();
  }, []);

  const onSubmitForm = useCallback(async () => {
    try {
      let values = await form.validateFields();
      if (current && current.id) {
        values.id = current.id;
      }
      onSubmit(values);
    } catch (e) {
      console.error(e);
    }
  }, [current]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue(current);
    }
  }, [current]);

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Form.Item label={ShipHostLabels.identityNumber} name="identityNumber">
          <Input placeholder="请输入主机编号" />
        </Form.Item>

        <Form.Item label={ShipHostLabels.modelType} name="modelType">
          <Input placeholder="请输入主机种类" />
        </Form.Item>

        <Form.Item label={ShipHostLabels.power} name="power">
          <InputNumber placeholder="请输入主机功率 (KW)" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={ShipHostLabels.remark} name="remark">
          <Input.TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>
      </Form>

      <div className={styles.footer}>
        <Button className={styles.btn} size="middle" onClick={onResetForm}>
          取消
        </Button>
        <Button className={styles.btn} type="primary" size="middle" onClick={onSubmitForm}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default ShipHostEditForm;
