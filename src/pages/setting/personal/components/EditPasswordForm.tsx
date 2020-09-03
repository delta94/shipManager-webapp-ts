import React from 'react';
import { Form, Input, Button, message } from 'antd';

interface EditPasswordFormProps {
  onSubmit: Function;
  onCancel: Function;
}

const EditPasswordForm: React.FC<EditPasswordFormProps> = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const onFormFinish = (values: any) => {
    if (values.newPassword !== values.newPasswordRepeated) {
      message.warn('重复密码和新密码不一样');
      return;
    }
    if (values.newPassword == values.password) {
      message.warn('新密码和原来的一样');
      return;
    }
    onSubmit(values);
  };

  const onFormCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFormFinish} onReset={onFormCancel}>
      <Form.Item
        name="currentPassword"
        label={'当前密码'}
        rules={[
          {
            required: true,
            message: `请输入当前密码`,
          },
        ]}
      >
        <Input placeholder={`请输入当前密码`} type="password" />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label={'新密码'}
        rules={[
          {
            required: true,
            max: 20,
            min: 6,
            whitespace: true,
            message: `请输入新密码, 长度限制6-20, 不包含空格`,
          },
        ]}
      >
        <Input placeholder={`请输入新密码`} type="password" />
      </Form.Item>

      <Form.Item
        name="newPasswordRepeated"
        label={'重复新密码'}
        rules={[
          {
            required: true,
            message: `请重复输入新密码`,
          },
        ]}
      >
        <Input placeholder={`请重复输入新密码`} type="password" />
      </Form.Item>

      <div style={{ height: 40 }} />
      <div className="g-ant-modal-footer">
        <Button style={{ marginRight: 12 }} htmlType="reset">
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditPasswordForm;
