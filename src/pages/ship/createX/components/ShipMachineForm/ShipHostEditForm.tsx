import * as React from 'react';
import Form from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import Input from 'antd/es/input/Input';
import { FormComponentProps } from 'antd/es/form';
import { IShipHost } from '@/interfaces/IShip';

interface ShipHostEditFormProps extends FormComponentProps {
  current: Partial<IShipHost> | undefined;
}

class ShipHostEditForm extends React.Component<ShipHostEditFormProps> {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const {
      form: { getFieldDecorator },
      current,
    } = this.props;

    return (
      <Form>
        <FormItem label="主机编号" {...this.formLayout}>
          {getFieldDecorator('identityNumber', {
            initialValue: current ? current.identityNumber : '',
            rules: [
              {
                required: true,
                message: '请输入主机编号',
              },
            ],
          })(<Input placeholder="请输入主机编号" />)}
        </FormItem>

        <FormItem label="主机种类" {...this.formLayout}>
          {getFieldDecorator('modelType', {
            initialValue: current ? current.modelType : '',
            rules: [
              {
                required: true,
                message: '请输入主机编号',
              },
            ],
          })(<Input placeholder="请输入主机种类" />)}
        </FormItem>

        <FormItem label="主机功率" {...this.formLayout}>
          {getFieldDecorator('power', {
            initialValue: current ? current.power : '',
            rules: [
              {
                required: true,
                message: '请输入主机功率',
              },
            ],
          })(<Input placeholder="请输入主机功率 (KW)" />)}
        </FormItem>

        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入备注',
              },
            ],
            initialValue: current ? current.remark : '',
          })(<TextArea rows={4} placeholder="请输入备注" />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create<ShipHostEditFormProps>()(ShipHostEditForm);
