import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Form, Modal, Input } from 'antd';

interface EditPasswordFormProps extends FormComponentProps {
  visible: boolean;
  onCancel(): void;
  onCreate(): void;
}

class EditPasswordForm extends React.Component<EditPasswordFormProps> {
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal visible={visible} title="更改密码" okText="更改" onCancel={onCancel} onOk={onCreate}>
        <Form layout="vertical">
          <Form.Item label="当前密码">
            {getFieldDecorator('currentPassword')(<Input type="password" />)}
          </Form.Item>
          <Form.Item label="新的密码">
            {getFieldDecorator('newPassword')(<Input type="password" />)}
          </Form.Item>
          <Form.Item label="重复新的密码">
            {getFieldDecorator('newPasswordRepeated')(<Input type="password" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<EditPasswordFormProps>({ name: 'form_in_modal' })(EditPasswordForm);
