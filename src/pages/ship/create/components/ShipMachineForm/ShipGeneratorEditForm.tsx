import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { IShipGenerator } from '@/interfaces/IShip';
import styles from '@/pages/ship/create/components/ShipMachineForm/index.less';

interface ShipGeneratorEditFormProps {
  current?: Partial<IShipGenerator>;
  onSubmit(data: Partial<IShipGenerator>): Promise<any>;
  onCancel(): void;
}

const ShipGeneratorEditForm: React.FC<ShipGeneratorEditFormProps> = ({
  current,
  onSubmit,
  onCancel,
}) => {
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
        <Form.Item label="发电机编号" name="identityNumber">
          <Input placeholder="请输入发电机编号" />
        </Form.Item>

        <Form.Item label="发电机种类" name="modelType">
          <Input placeholder="请输入发电机种类" />
        </Form.Item>

        <Form.Item label="发电机功率" name="power">
          <InputNumber placeholder="请输入发电机功率 (KW)" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="备注" name="remark">
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

export default ShipGeneratorEditForm;
