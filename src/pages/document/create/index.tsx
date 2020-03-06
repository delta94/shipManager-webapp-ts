import React from 'react';
import { Card, Button, Form, Radio, Input, Select, message } from 'antd';
import { connect } from 'dva';
import {RouteComponentProps, routerRedux} from 'dva/router';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { CompanySheetState } from '@/models/companySheet';
import FileUpload from '@/components/FileUpload';
import {ICompanySheetType} from "@/interfaces/ICompanySheet";
import { UserModelState } from '@/models/user';
import IAccount from "@/interfaces/IAccount";
import moment from "moment";

const FormItem = Form.Item;

const { Option } = Select;

interface CompanySheetCreateProps extends FormComponentProps, RouteComponentProps<{type: string}> {
  dispatch: Dispatch<any>;
  submitting: boolean;
  user: IAccount
  types: ICompanySheetType[]
}

@connect(
  ({
     companySheet,
     user,
     loading,
   }: {
    user: UserModelState,
    companySheet: CompanySheetState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    submitting: loading.effects['companySheet/create'],
    user: user.currentUser,
    types: companySheet.types
  }),
)
class CompanySheetCreate extends React.Component<CompanySheetCreateProps> {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'companySheet/fetchSheetTypes' });

    let isTemplate = this.props.match.params.type == "template";

    this.props.form.setFieldsValue({
      isTemplate: isTemplate
    });
  }

  handleCompanySheetCreated = () => {
    message.success('表格信息已录入');
    let route = this.props.match.params.type == "common" ? '/document/common/list' : '/document/template/list';
    this.props.dispatch(routerRedux.push(route));
  };

  handleSubmit = (e: any) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        if (values.ossFile && values.ossFile.fileList) {
          let file = values.ossFile.fileList.pop();
          values.ossFile = file.result;
          values.fileSize = file.size;
        }

        values.uploader = this.props.user.login;
        values.updateAt = moment().format("YYYY-MM-DD");

        dispatch({
          type: 'companySheet/create',
          payload: values,
          callback: this.handleCompanySheetCreated,
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
      <PageHeaderWrapper title="新表格信息" content="按表单提示填入相应信息">
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="文件名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入文件名',
                  },
                ],
              })(<Input placeholder="请输入文件名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="文件分类">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: true,
                    message: '请选择文件分类',
                  },
                ],
              })(
                <Select placeholder="请选择分类">
                  {types &&
                  types.map((item, index) => (
                    <Option value={item.id} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为自定义表单">
              {getFieldDecorator('isTemplate')(
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>不是</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="文件">
              {getFieldDecorator('ossFile', {
                initialValue: { fileList: [] },
                rules: [
                  {
                    required: true,
                    message: '请上传文件',
                  }
                ]
              })(<FileUpload />)}
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

export default Form.create<CompanySheetCreateProps>()(CompanySheetCreate);
