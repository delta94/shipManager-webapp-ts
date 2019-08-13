import * as React from 'react';

import {
  Card,
  Button,
  Form,
  Icon,
  Input,
  Select,
  Popover,
  Modal
} from 'antd';
import { connect } from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {message} from "antd/lib/index";
import {routerRedux} from "dva/router";
import {Dispatch} from "redux";
import {FormComponentProps} from "antd/es/form";
import {IManagerAssignerPosition, IManagerCert, IManagerCertType} from "@/interfaces/IManager";
import {ManagerModelState} from "@/models/manager";
import ManagerCertEditForm from "./components/ManagerCertEditForm";
import FooterToolbar from "@/components/FooterToolbar";
import ManagerCertList from "./components/ManagerCertList";
import styles from "./style.less"
import uuidv1 from "uuid/v1"

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
  submitting: boolean
  certType: IManagerCertType[]
  assignerPositions: IManagerAssignerPosition[]
}

interface ShipCreateState {
  width: string
  done: boolean
  visible: boolean
  certList: IManagerCert[]
  current: IManagerCert | undefined
}

@connect(({ loading, manager }: {
  manager: ManagerModelState,
  loading: { effects: { [key: string]: boolean } }
}) => ({
  submitting: loading.effects['manager/create'],
  assignerPositions: manager.assignerPositions,
  certType: manager.certificateTypes
}))
class ManagerCreate extends React.Component<ManagerCreateProps, ShipCreateState> {

  state = {
    width: '100%',
    done: false,
    visible: false,
    certList: [{
      "id" : 1,
      "name" : "培训证书",
      "identityNumber" : "44018-11994-232311",
      "expiredAt" : "2019-02-06",
      "ossFile" : "",
      "remark" : "",
      "managerId" : 1,
      "managerName" : "张晋晋",
      "typeId" : 1,
      "typeName" : "安监培训证书",
      "typeRemark" : "",
      "icon" : "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"
    }],
    current: undefined
  };

  formRef: any

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({type: 'manager/fetchAssignerPositions'});
    dispatch({type: 'manager/fetchCertificateTypes'});
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

  handleShowCreateModal = (current: IManagerCert | undefined) => {
    this.setState({
      visible: true,
      current: current
    });
  };

  handleRemoveCertItem = (item: IManagerCert) => {
    let list = this.state.certList.filter(v => v.id == item.id);
    this.setState({ certList: list })
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

  handleCertSubmit = () => {
    const { form } = this.formRef.props;

    form.validateFieldsAndScroll((err: boolean, values: any) => {
      if (err) {
        return;
      }
      form.resetFields();

      let item = {
        id: uuidv1(),
        name: values['cert_name'],
        expiredAt: values['cert_expiredAt'] && values['cert_expiredAt'].format("YYYY-MM-DD"),
        remark: values['cert_remark'],
        typeId: values['cert_typeId'],
        identityNumber: values['cert_identityNumber'],
        ossFile: ""
      } as IManagerCert;

      let certList = [
        ...this.state.certList,
        item
      ];

      this.setState({ visible: false, certList });
    });
  };

  handleCertCancel = () => {
    this.setState({
      visible: false,
      current: undefined
    })
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };


  render() {
    const {
      submitting,
      assignerPositions,
      certType,
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
            {getFieldDecorator('certs', { initialValue: { certList: this.state.certList } })(
              <ManagerCertList removeCertItem={this.handleRemoveCertItem} showCreateModal={this.handleShowCreateModal}/>
            )}
          </Card>

          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
              创建管理人员
            </Button>
          </FooterToolbar>
        </Card>

        <Modal
          title={'编辑'}
          width={640}
          bodyStyle={{ padding: '28px 0' }}
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleCertSubmit}
          onCancel={this.handleCertCancel}
        >
          <ManagerCertEditForm
            wrappedComponentRef={this.saveFormRef}
            certificateTypes={certType}
            current={this.state.current} />
        </Modal>

      </PageHeaderWrapper>
    )
  }
}

export default Form.create<ManagerCreateProps>()(ManagerCreate);
