import * as React from 'react';
import Form from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import Select from 'antd/es/select';
import TextArea from 'antd/es/input/TextArea';
import Input from 'antd/es/input/Input';
import { FormComponentProps } from 'antd/es/form';
import IShipPayload from '@/interfaces/IShipPayload';
import { IShipBusinessArea } from '@/interfaces/IShip';

const { Option } = Select;

interface ShipPayloadEditFormProps extends FormComponentProps {
  current: Partial<IShipPayload> | undefined;
  type: IShipBusinessArea[];
}

class ShipPayloadEditForm extends React.Component<ShipPayloadEditFormProps> {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const {
      form: { getFieldDecorator },
      current,
      type,
    } = this.props;

    return (
      <Form>
        <FormItem label="航区类型" {...this.formLayout}>
          {getFieldDecorator('areaId', {
            rules: [{ required: true, message: '请选择航区类型' }],
            initialValue: current ? current.areaId : '',
          })(
            <Select placeholder="请选择航区类型">
              {type &&
                type.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                ))}
            </Select>,
          )}
        </FormItem>

        <FormItem label="吨位" {...this.formLayout}>
          {getFieldDecorator('tone', {
            rules: [{ required: true, message: '请输入吨位' }],
            initialValue: current ? current.tone : '',
          })(<Input placeholder="请输入" />)}
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

export default Form.create<ShipPayloadEditFormProps>()(ShipPayloadEditForm);
