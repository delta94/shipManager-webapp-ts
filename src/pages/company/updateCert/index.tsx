import React from 'react';
import { Card, Button, Form, DatePicker, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
import { ICompanyCert, ICompanyCertType } from '@/interfaces/ICompany';
import FileUpload from '@/components/FileUpload';
import { CompanyCertModelState } from '@/models/companyCert';

const FormItem = Form.Item;

const { Option } = Select;

interface CompanyCertParams {
  id: string;
}

interface CompanyCertUpdateProps
  extends FormComponentProps,
    RouteComponentProps<CompanyCertParams> {
  dispatch: Dispatch<any>;
  submitting: boolean;
  companyCert: ICompanyCert;
  certificateTypes: ICompanyCertType[];
}

@connect(
  ({
    companyCert,
    loading,
  }: {
    companyCert: CompanyCertModelState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    companyCert: companyCert.target,
    submitting: loading.effects['companyCert/update'],
    certificateTypes: companyCert.certificateTypes,
  }),
)
class CompanyCertUpdate extends React.Component<CompanyCertUpdateProps> {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({ type: 'companyCert/fetchCertificateTypes' });
      dispatch({
        type: 'companyCert/target',
        payload: params.id,
        callback: this.setCompanyCertInfo,
      });
    }
  }

  setCompanyCertInfo = () => {
    const { companyCert, form } = this.props;

    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};

      if (key === 'expiredAt' && companyCert[key]) {
        obj[key] = moment(companyCert[key]);
      } else if (key === 'ossFile' && companyCert[key]) {
        const fileStr = companyCert[key];
        const fileList = fileStr.split(';').map((value, index) => ({
          uid: `pre_${index}`,
          name: value,
          status: 'done',
          type: '',
          result: value,
          url: value,
        }));
        obj[key] = { fileList };
      } else {
        obj[key] = companyCert[key] || null;
      }
      form.setFieldsValue(obj);
    });
  };

  handleCompanyCertUpdated = () => {
    message.success('公司证书信息已更新');
    this.props.dispatch(routerRedux.push('/company/listCert'));
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form, companyCert } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.ossFile && values.ossFile.fileList) {
          values.ossFile = values.ossFile.fileList.map((value: any) => value.url).join(';');
        }
        values.id = companyCert.id;
        dispatch({
          type: 'companyCert/update',
          payload: values,
          callback: this.handleCompanyCertUpdated,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      certificateTypes,
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
      <PageHeaderWrapper title="更新公司证书信息" content="按表单提示填入相应信息">
        <Card title="证书信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="证书名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入证书名',
                  },
                ],
              })(<Input placeholder="请输入证书名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="证书编号">
              {getFieldDecorator('identityNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入证书编号',
                  },
                ],
              })(<Input placeholder="请输入证书编号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="证书类型">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: true,
                    message: '请输入证书类型',
                  },
                ],
              })(
                <Select placeholder="请选择证书类型">
                  {certificateTypes &&
                    certificateTypes.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="证书过期日期">
              {getFieldDecorator('expiredAt', {
                rules: [{ required: true, type: 'object', message: '请输入建造完工日期' }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  placeholder="请选择证书过期日期"
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="证书电子件">
              {getFieldDecorator('ossFile', {
                initialValue: { fileList: [] },
              })(<FileUpload />)}
            </FormItem>

            <FormItem {...formItemLayout} label="证书备注">
              {getFieldDecorator('remark')(<Input.TextArea placeholder="请输入证书备注" />)}
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

export default Form.create<CompanyCertUpdateProps>()(CompanyCertUpdate);
