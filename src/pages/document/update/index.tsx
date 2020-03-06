import React from 'react';
import { Card, Button, Form, Input, Select, message, Radio } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
import { ICompanySheet, ICompanySheetType } from '@/interfaces/ICompanySheet';
import FileUpload from '@/components/FileUpload';
import { CompanySheetState } from '@/models/companySheet';

const FormItem = Form.Item;

const { Option } = Select;

interface CompanySheetParams {
  id: string;
}

interface CompanySheetUpdateProps
  extends FormComponentProps,
    RouteComponentProps<CompanySheetParams> {
  dispatch: Dispatch<any>;
  submitting: boolean;
  companySheet: ICompanySheet;
  types: ICompanySheetType[];
}

@connect(
  ({
    companySheet,
    loading,
  }: {
    companySheet: CompanySheetState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    companySheet: companySheet.target,
    submitting: loading.effects['companySheet/update'],
    types: companySheet.types,
  }),
)
class CompanySheetUpdate extends React.Component<CompanySheetUpdateProps> {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({ type: 'companySheet/fetchSheetTypes' });
      dispatch({
        type: 'companySheet/target',
        payload: params.id,
        callback: this.setCompanySheetInfo,
      });
    }
  }

  setCompanySheetInfo = () => {
    const { companySheet, form } = this.props;

    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};

      if (key === 'expiredAt' && companySheet[key]) {
        obj[key] = moment(companySheet[key]);
      } else if (key == 'isTemplate') {
        obj[key] = companySheet[key];
      } else if (key === 'ossFile' && companySheet[key]) {
        const fileStr = companySheet[key];
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
        obj[key] = companySheet[key] || null;
      }

      form.setFieldsValue(obj);
    });
  };

  handleCompanySheetUpdated = () => {
    message.success('已更新');
    this.props.dispatch(routerRedux.push('/common/list'));
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form, companySheet } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.ossFile && values.ossFile.fileList) {
          values.ossFile = values.ossFile.fileList.map((value: any) => value.url).join(';');
          values.fileSize;
        }
        values.id = companySheet.id;
        dispatch({
          type: 'companySheet/update',
          payload: values,
          callback: this.handleCompanySheetUpdated,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      types,
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
      <PageHeaderWrapper title="更新表单信息" content="按提示填入相应信息">
        <Card title="文件信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="表单名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入表单名',
                  },
                ],
              })(<Input placeholder="请输入表单名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="上传者">
              {getFieldDecorator('uploader', {
                rules: [
                  {
                    required: false,
                    message: '请输入上传者',
                  },
                ],
              })(<Input placeholder="请输入上传者" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否自定义">
              {getFieldDecorator('isTemplate')(
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>不是</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="表格类型">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: true,
                    message: '请输入表格类型',
                  },
                ],
              })(
                <Select placeholder="请输入表格类型">
                  {types &&
                    types.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="电子件">
              {getFieldDecorator('ossFile', {
                initialValue: { fileList: [] },
              })(<FileUpload listType="text" />)}
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

export default Form.create<CompanySheetUpdateProps>()(CompanySheetUpdate);
