import * as React from 'react';

import {
  Card,
  Button,
  Form,
  Input,
  Select
} from 'antd';
import { connect } from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {message} from "antd/lib/index";
import {routerRedux} from "dva/router";
import styles from "./style.less"
import {Dispatch} from "redux";
import {FormComponentProps} from "antd/es/form";
import {IManagerAssignerPosition} from "@/interfaces/IManager";
import {ManagerModelState} from "@/models/manager";

const FormItem = Form.Item;
const Option = Select.Option;

interface ManagerCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  assignerPositions: IManagerAssignerPosition[]
}

@connect(({ loading, manager }: {
  manager: ManagerModelState,
  loading: { effects: { [key: string]: boolean } }
}) => ({
  submitting: loading.effects['manager/create'],
  assignerPositions: manager.assignerPositions
}))
class ManagerCreate extends React.Component<ManagerCreateProps> {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({type: 'manager/fetchAssignerPositions'});
  }

  showModal = () => {

  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'manager/create',
          payload: values,
          callback: () => {
            message.success('管理人员信息已录入');
            this.props.dispatch(routerRedux.push('/person/manager/list'));
          }
        });
      }
    });
  };

  render() {

    const {
      submitting,
      assignerPositions,
      form: { getFieldDecorator }
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
      <PageHeaderWrapper title="新管理人员信息">
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="管理人员姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入管理人员姓名',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="身份证号码">
              {getFieldDecorator('identityNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入管理人员身份证号码',
                  },
                ],
              })(<Input placeholder="请输入身份证号码" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="指定职位">
              {getFieldDecorator('assignerId', {
                rules: [
                  {
                    required: true,
                    message: '请输入指定职位',
                  }
                ],
              })(
                <Select placeholder="请选择职位">
                  {
                    assignerPositions && assignerPositions.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: false,
                    message: '请输入手机',
                  },
                ],
              })(<Input placeholder="请输入手机" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="座机电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: false,
                    message: '请输入座机电话',
                  },
                ],
              })(<Input placeholder="请输入座机电话" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="部门">
              {getFieldDecorator('dept', {
                rules: [
                  {
                    required: true,
                    message: '请输入部门',
                  },
                ],
              })(<Input placeholder="请输入部门" />)}
            </FormItem>


            <FormItem {...formItemLayout} label="职务">
              {getFieldDecorator('position', {
                rules: [
                  {
                    required: true,
                    message: '请输入职务',
                  },
                ],
              })(<Input placeholder="请输入职务" />)}
            </FormItem>


            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>

        <Card className={styles.certSection} title="资格证书信息" bordered={false}>
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
          >
            添加
          </Button>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<ManagerCreateProps>()(ManagerCreate);
