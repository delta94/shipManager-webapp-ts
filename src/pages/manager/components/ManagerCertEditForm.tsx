import * as React from 'react'
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import Select from "antd/es/select";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";
import {FormComponentProps} from "antd/es/form";
import {IManagerCert, IManagerCertType} from "src/interfaces/IManager";
import moment from "moment";
import {DatePicker} from 'antd';

const Option = Select.Option;

interface ManagerCertEditFormProps extends FormComponentProps {
  current: IManagerCert | undefined
  certificateTypes: IManagerCertType[]
}

class ManagerCertEditForm extends React.Component<ManagerCertEditFormProps> {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  handleSubmit = () => {
    debugger
  };

  render() {

    const { form: { getFieldDecorator }, current, certificateTypes } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="证书名" {...this.formLayout}>
          {getFieldDecorator('cert_name', {
            rules: [{ required: true, message: '请输入证书名称' }],
            initialValue: current ? current.name : "",
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="证书编号" {...this.formLayout}>
          {getFieldDecorator('cert_identityNumber', {
            rules: [{ required: true, message: '请输入证书编号' }],
            initialValue: current ? current.identityNumber : "",
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="证书过期时间" {...this.formLayout}>
          {getFieldDecorator('cert_expiredAt', {
            rules: [{ required: true, message: '请选择证书过期时间' }],
            initialValue: current ? (current.expiredAt ? moment(current.expiredAt) : null) : null
          })(
            <DatePicker placeholder="请选择证书过期日期" format="YYYY-MM-DD" style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem label="证书类型" {...this.formLayout}>
          {getFieldDecorator('cert_typeId', {
            rules: [{ required: true, message: '请选择证书类型' }],
            initialValue: current ? current.typeId : ""
          })(
            <Select placeholder="请选择证书类型">
              {
                certificateTypes && certificateTypes.map((item, index) => {
                  return <Option value={item.id} key={index}>{item.name}</Option>
                })
              }
            </Select>
          )}
        </FormItem>

        <FormItem label="证书电子件" {...this.formLayout}>
          todo
        </FormItem>

        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('cert_remark', {
            rules: [{
              required: false,
              message: '请输入备注'
            }],
            initialValue: current ? current.remark : ""
          })(<TextArea rows={4} placeholder="请输入证书备注" />)}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create<ManagerCertEditFormProps>()(ManagerCertEditForm);
