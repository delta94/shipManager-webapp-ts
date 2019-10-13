import React from 'react';
import { Card, Button, Form, DatePicker, Input, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import FileUpload from '@/components/FileUpload';

const FormItem = Form.Item;

interface CompanyLicenseCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
}

@connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['companyLicense/create'],
}))
class CompanyLicenseCreate extends React.Component<CompanyLicenseCreateProps> {
  handleCompanyLicenseCreated = () => {
    message.success('公司批文信息已录入');
    this.props.dispatch(routerRedux.push('/company/listLicense'));
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.ossFile && values.ossFile.fileList) {
          values.ossFile = values.ossFile.fileList.map((value: any) => value.url).join(';');
        }
        dispatch({
          type: 'companyLicense/create',
          payload: values,
          callback: this.handleCompanyLicenseCreated,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 },
      },
    };

    return (
      <PageHeaderWrapper title="新的公司批文信息" content="按表单提示填入相应信息">
        <Card title="批文信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="批文名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入批文名',
                  },
                ],
              })(<Input placeholder="请输入批文名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="批文编号">
              {getFieldDecorator('identityNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入批文编号',
                  },
                ],
              })(<Input placeholder="请输入批文编号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="批文过期日期">
              {getFieldDecorator('expireAt', {
                rules: [{ required: true, type: 'object', message: '请输入批文过期日期' }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  placeholder="请选择批文过期日期"
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="批文电子件">
              {getFieldDecorator('ossFile', {
                initialValue: { fileList: [] },
              })(<FileUpload />)}
            </FormItem>

            <FormItem {...formItemLayout} label="批文备注">
              {getFieldDecorator('remark')(<Input.TextArea placeholder="请输入批文备注" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<CompanyLicenseCreateProps>()(CompanyLicenseCreate);
