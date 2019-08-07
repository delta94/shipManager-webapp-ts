import * as React from 'react';

import {
  Card,
  Button,
  Form,
  Icon,
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {message} from "antd/lib/index";
import {routerRedux} from "dva/router";
import {Dispatch} from "redux";
import {FormComponentProps} from "antd/es/form";
import {IManagerAssignerPosition} from "@/interfaces/IManager";
import {ManagerModelState} from "@/models/manager";
import FooterToolbar from "@/components/FooterToolbar";
import ManagerCertList from "./components/ManagerCertList";
import styles from "./style.less"

const fieldLabels = {
  "name": "管理人员姓名",
  "identityNumber": "身份证号码",
  "assignerId": "指定职位",
  "mobile": "手机号码",
  "phone": "座机电话",
  "dept": "部门",
  "position": "职务"
};

const FormItem = Form.Item;
const Option = Select.Option;

interface ManagerCreateProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  assignerPositions: IManagerAssignerPosition[]
}

interface ShipCreateState {
  width: string
}

@connect(({ loading, manager }: {
  manager: ManagerModelState,
  loading: { effects: { [key: string]: boolean } }
}) => ({
  submitting: loading.effects['manager/create'],
  assignerPositions: manager.assignerPositions
}))
class ManagerCreate extends React.Component<ManagerCreateProps, ShipCreateState> {

  state = {
    width: '100%',
  };

  certList = [];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({type: 'manager/fetchAssignerPositions'});
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  getErrorInfo = () => {
    const { form: { getFieldsError } } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) { return null }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
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

    const { width } = this.state;

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

    return (
      <PageHeaderWrapper title="新管理人员信息">
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={fieldLabels.name}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入管理人员姓名',
                  },
                ],
              })(<Input placeholder="请输入姓名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.identityNumber}>
              {getFieldDecorator('identityNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入管理人员身份证号码',
                  },
                ],
              })(<Input placeholder="请输入身份证号码" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.assignerId}>
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

            <FormItem {...formItemLayout} label={fieldLabels.mobile}>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: false,
                    message: '请输入手机',
                  },
                ],
              })(<Input placeholder="请输入手机" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.phone}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: false,
                    message: '请输入座机电话',
                  },
                ],
              })(<Input placeholder="请输入座机电话" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.dept}>
              {getFieldDecorator('dept', {
                rules: [
                  {
                    required: true,
                    message: '请输入部门',
                  },
                ],
              })(<Input placeholder="请输入部门" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={fieldLabels.position}>
              {getFieldDecorator('position', {
                rules: [
                  {
                    required: true,
                    message: '请输入职务',
                  },
                ],
              })(<Input placeholder="请输入职务" />)}
            </FormItem>
          </Form>

          <Card title="资格证书" bordered={false}>
            <ManagerCertList certList={this.certList}/>
          </Card>

          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
              创建管理人员
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<ManagerCreateProps>()(ManagerCreate);
