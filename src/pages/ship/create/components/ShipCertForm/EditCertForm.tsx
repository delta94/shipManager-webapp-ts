import * as React from 'react';
import { DatePicker, Select, Input, Form } from 'antd';
import FileUpload from '@/components/FileUpload';

import { IShipCertificate, IShipCertType } from '@/interfaces/IShip';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface ShipEditCertFormProps extends FormComponentProps {
  current: IShipCertificate | undefined;
  type: IShipCertType[];
}

class ShipEditCertForm extends React.Component<ShipEditCertFormProps> {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { form } = this.props;
    if (this.props.current) {
      let item = this.props.current;
      if (item.ossFile) {
        const fileList = item.ossFile.split(';').map((value, index) => ({
          uid: `pre_${index}`,
          name: value,
          status: 'done',
          type: '',
          result: value,
          url: value,
        }));
        form.setFieldsValue({ ossFile: { fileList } });
      }
      if (item.expiredAt) {
        let value = moment(item.expiredAt);
        form.setFieldsValue({ expireAt: value });
      }
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      current,
      type,
    } = this.props;

    return (
      <Form>
        <FormItem label="航区类型" {...this.formLayout}>
          {getFieldDecorator('typeId', {
            rules: [{ required: true, message: '请选择航区类型' }],
            initialValue: current ? current.typeId : '',
          })(
            <Select placeholder="请选择证书类型">
              {type &&
                type.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                ))}
            </Select>,
          )}
        </FormItem>

        <FormItem label="证书编号" {...this.formLayout}>
          {getFieldDecorator('identityNumber', {
            rules: [{ required: true, message: '请输入证书编号' }],
            initialValue: current ? current.identityNumber : '',
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="证书颁发机构" {...this.formLayout}>
          {getFieldDecorator('tone', {
            rules: [{ required: true, message: '请输入证书颁发机构' }],
            initialValue: current ? current.issueBy : '',
          })(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="证书电子件" {...this.formLayout}>
          {getFieldDecorator('ossFile', {
            initialValue: { fileList: [] },
          })(<FileUpload />)}
        </FormItem>

        <FormItem label={'证书过期日期'} {...this.formLayout}>
          {getFieldDecorator('expireAt', {
            rules: [{ required: true, type: 'object', message: '请输入证书过期日期' }],
          })(
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              placeholder="请选择过期日期"
            />,
          )}
        </FormItem>

        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('remark', {
            rules: [{ required: false, message: '请输入备注' }],
            initialValue: current ? current.remark : '',
          })(<TextArea rows={4} placeholder="请输入备注" />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create<ShipEditCertFormProps>()(ShipEditCertForm);
