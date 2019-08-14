import React from 'react';
import {
  Card,
  Button,
  Form,
  Radio,
  Input,
  Select,
  message,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import PageHeaderWrapper from '@ant-design/pro-layout/es/PageHeaderWrapper';
import { IShipMeta } from '@/interfaces/IShip';
import { SailorModelState } from '@/models/sailor';
import { ISailorPosition } from '@/interfaces/ISailor';

const FormItem = Form.Item;

const { TextArea } = Input;

const { Option } = Select;

interface SailorCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  positions: ISailorPosition[],
  shipListMeta: IShipMeta[],
}

@connect(({ sailor, loading }: {
    sailor: SailorModelState
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    submitting: loading.effects['sailor/add'],
    positions: sailor.positions,
    shipListMeta: sailor.shipListMeta,
  }),
)
class SailorCreate extends React.Component<SailorCreateProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'sailor/fetchPositionTypes' });
    dispatch({ type: 'sailor/fetchShipMetaList' });
  }

  handleSailorCreated = () => {
    message.success('船员信息已录入');
    this.props.dispatch(routerRedux.push('/person/sailor/list'));
  };

  handleSubmit = (e: any) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // if (values.certFile && values.certFile.fileList) {
        //   values.certFile = values.certFile.fileList.map(value => value.url).join(";");
        // }
        dispatch({
          type: 'sailor/create',
          payload: values,
          callback: this.handleSailorCreated,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      positions,
      shipListMeta,
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
      <PageHeaderWrapper title="新船员信息" content="按表单提示填入相应信息">
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="船员姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="身份证号码">
              {getFieldDecorator('identityNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入船员身份证号码',
                  },
                ],
              })(<Input placeholder="请输入身份证号码" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="常任职位">
              {getFieldDecorator('positionId', {
                rules: [
                  {
                    required: true,
                    message: '请输入职位',
                  },
                ],
              })(
                <Select placeholder="请选择职位">
                  {
                    positions && positions.map((item, index) => <Option value={item.id} key={index}>{item.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="手机号码">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机',
                  },
                ],
              })(<Input placeholder="请输入手机" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属船舶">
              {getFieldDecorator('shipId', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属船舶',
                  },
                ],
              })(
                <Select placeholder="请选择所属船舶">
                  {
                    shipListMeta && shipListMeta.map((item, index) => <Option value={item.id} key={index}>{item.name}</Option>)
                  }
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="是否为高级船员">
              {getFieldDecorator('isAdvanced')(
                <Radio.Group>
                  <Radio value defaultChecked>是</Radio>
                  <Radio value={false}>不是</Radio>
                </Radio.Group>,
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="家庭地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系地址',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入联系地址" rows={4} />)}
            </FormItem>


            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<SailorCreateProps>()(SailorCreate);
