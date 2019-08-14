import * as React from 'react';

import {
  Card,
  Button,
  Form,
  Input,
  Radio,
  Select,
  message
} from 'antd';
import { connect } from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';

import { routerRedux } from 'dva/router';
import { Dispatch } from 'redux';
import { IShipMeta } from '@/interfaces/IShip';
import { default as ISailor, ISailorPosition } from '@/interfaces/ISailor';
import { FormComponentProps } from 'antd/es/form';
import { SailorModelState } from '@/models/sailor';
import { RouteComponentProps } from 'react-router';

const FormItem = Form.Item;
const {Option} = Select;
const { TextArea } = Input;

interface BaseUpdateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  positions: ISailorPosition[],
  shipListMeta: IShipMeta[],
  targetSailor: ISailor
}

interface SailorUpdateRouteParams {
  id: string
}

type SailorUpdateProps = BaseUpdateProps & RouteComponentProps<SailorUpdateRouteParams>

@connect(({ loading, sailor }: {
  sailor: SailorModelState,
  loading: { effects: { [key: string]: boolean } }
}) => ({
  submitting: loading.effects['sailor/update'],
  positions: sailor.positions,
  shipListMeta: sailor.shipListMeta,
  targetSailor: sailor.target,
}))
class SailorUpdate extends React.Component<SailorUpdateProps> {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'sailor/fetchPositionTypes' });
    dispatch({ type: 'sailor/fetchShipMetaList' });

    if (params.id) {
      const sailorId = parseInt(params.id, 10);
      setTimeout(() => {
        this.props.dispatch({
          type: 'sailor/target',
          payload: sailorId,
          callback: this.setSailorInfo,
        })
      }, 10)
    }
  }

  setSailorInfo = () => {
    const { targetSailor, form } = this.props;

    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};

      if (key === 'certFile' && targetSailor[key]) {
        const fileStr = targetSailor[key];
        const fileList = fileStr.split(';').map((value, index) => ({
            uid: "pre_" + index,
            name: value,
            status: 'done',
            type: '',
            result: value,
            url: value
          }));
        obj[key] = { fileList }
      } else {
        obj[key] = targetSailor[key] || null;
      }
      form.setFieldsValue(obj);
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form, targetSailor } = this.props;
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.certFile && values.certFile.fileList) {
          // @ts-ignore
          values.certFile = values.certFile.fileList.map(value => value.url).join(';');
        }

        dispatch({
          type: 'sailor/update',
          payload: { id: targetSailor.id, ...values },
          callback: this.handleSailorUpdated,
        });
      }
    });
  };

  handleSailorUpdated = () => {
    message.success('船员信息已更新');
    this.props.dispatch(routerRedux.push('/person/sailor/list'));
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
      <PageHeaderWrapper title="更新船员信息" content="按表单提示填入相应信息">
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

            <FormItem {...formItemLayout} label="证书电子件">
              todo
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

export default Form.create<SailorUpdateProps>()(SailorUpdate);
