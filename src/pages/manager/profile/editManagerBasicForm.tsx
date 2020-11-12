import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { IManager } from '@/interfaces/IManager';
import { ManagerKeyMap } from '@/services/managerService';
import { dateFormatter, dateFormatterToString } from '@/utils/parser';
import CategorySelect from '@/components/CategorySelect';

interface EditManagerBasicFormProps {
  manager?: Partial<IManager>;
  onSubmit: (value: any) => Promise<void>;
  onCancel: any;
}

const EditManagerBasicForm: React.FC<EditManagerBasicFormProps> = ({ manager, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (manager) {
      let values = dateFormatter({ ...manager });
      form.setFieldsValue({
        ...values,
      });
    }
  }, [manager]);

  const onFormFinish = (values: any) => {
    values = dateFormatterToString(values);
    setLoading(true);

    onSubmit(values).then(() => {
      setLoading(false);
    });
  };

  return (
    <Form form={form} onFinish={onFormFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={ManagerKeyMap.name}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerKeyMap.name}`} />
      </Form.Item>

      <Form.Item
        name="mobile"
        label={ManagerKeyMap.mobile}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.mobile}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerKeyMap.mobile}`} />
      </Form.Item>

      <Form.Item
        name="identityNumber"
        label={ManagerKeyMap.identityNumber}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.identityNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerKeyMap.identityNumber}`} />
      </Form.Item>

      <Form.Item
        name="gender"
        label={ManagerKeyMap.gender}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.gender}`,
          },
        ]}
      >
        <Select placeholder={`请选择 ${ManagerKeyMap.gender}`}>
          <Select.Option value={0}>男性</Select.Option>
          <Select.Option value={1}>女性</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="managerDutyId"
        label={ManagerKeyMap.managerDutyName}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.managerDutyName}`,
          },
        ]}
      >
        <CategorySelect category="ManagerDutyType" showNotChoose={false} />
      </Form.Item>

      <Form.Item
        name="managerPositionId"
        label={ManagerKeyMap.managerPositionName}
        rules={[
          {
            required: true,
            message: `请输入${ManagerKeyMap.managerPositionName}`,
          },
        ]}
      >
        <CategorySelect category="ManagerPositionType" showNotChoose={false} />
      </Form.Item>

      <Form.Item
        name="educationLevel"
        label={ManagerKeyMap.educationLevel}
        rules={[
          {
            required: false,
            message: `请输入${ManagerKeyMap.educationLevel}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerKeyMap.educationLevel}`} />
      </Form.Item>

      <Form.Item
        name="remark"
        label={ManagerKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入${ManagerKeyMap.remark}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerKeyMap.remark}`} />
      </Form.Item>

      <div style={{ height: 24 }} />

      <div className="g-ant-modal-footer">
        <Button style={{ marginRight: 12 }} onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" loading={loading} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditManagerBasicForm;
