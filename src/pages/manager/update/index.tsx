import * as React from 'react';
import { ManagerModelState } from '@/models/manager';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { RouteComponentProps } from 'react-router';
import {
  IManager,
  IManagerAssignerPosition,
  IManagerCert,
  IManagerCertType,
} from '@/interfaces/IManager';
import { Form, Card, Input, Button, Icon, Modal, Select, Popover, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import ManagerCertList from '@/pages/manager/components/ManagerCertList';
import FooterToolbar from '@/components/FooterToolbar';
import ManagerCertEditForm from '@/pages/manager/components/ManagerCertEditForm';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import { parseUploadedItem } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const fieldLabels = {
  name: '管理人员姓名',
  identityNumber: '身份证号码',
  assignerId: '指定职位',
  mobile: '手机号码',
  phone: '座机电话',
  dept: '部门',
  position: '职务',
};

interface Params {
  id: string;
}

interface ManagerUpdateProps extends RouteComponentProps<Params>, FormComponentProps {
  loading: boolean;
  manager: IManager;
  dispatch: Dispatch<any>;
  submitting: boolean;
  certType: IManagerCertType[];
  assignerPositions: IManagerAssignerPosition[];
}

interface ManagerUpdateState {
  width: string;
  done: boolean;
  visible: boolean;
  certList: IManagerCert[];
  current: IManagerCert | undefined;
}

@connect(
  ({
    manager,
    loading,
  }: {
    manager: ManagerModelState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    loading: loading.effects['manager/target'],
    submitting: loading.effects['manager/update'],
    manager: manager.target,
    certType: manager.certificateTypes,
    assignerPositions: manager.assignerPositions,
  }),
)
class ManagerUpdate extends React.Component<ManagerUpdateProps, ManagerUpdateState> {
  state = {
    width: '100%',
    done: false,
    visible: false,
    certList: [],
    current: undefined,
  };

  formRef: any;

  componentWillMount() {
    this.props.dispatch({ type: 'manager/fetchAssignerPositions' });
    this.props.dispatch({ type: 'manager/fetchCertificateTypes' });

    if (this.props.match.params.id) {
      const managerId = parseInt(this.props.match.params.id);
      setTimeout(() => {
        this.props.dispatch({
          type: 'manager/target',
          payload: managerId,
          callback: this.fillManagerInfo,
        });
      }, 10);
    }

    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  fillManagerInfo = () => {
    const { manager, form } = this.props;

    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      if (key == 'certs') {
        obj[key] = { certList: manager[key] };
      } else {
        obj[key] = manager[key] || null;
      }
      form.setFieldsValue(obj);
    });
  };

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
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
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
      current,
    });
  };

  handleRemoveCertItem = (item: IManagerCert) => {
    this.props.dispatch({
      type: 'manager/removeCert',
      payload: item.id,
      callback: this.handleCertRemoved,
    });
  };

  handleCertRemoved = (id: number) => {
    let { form } = this.props;
    message.success('证书已删除');
    let values = form.getFieldValue('certs');

    if (values && values.certList) {
      let certList: IManagerCert[] = values.certList.filter((item: IManagerCert) => item.id !== id);
      this.props.form.setFieldsValue({ certs: { certList } });
    }
  };

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
      match: { params },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        values.id = parseInt(params.id);
        delete values.certs;
        dispatch({
          type: 'manager/update',
          payload: values,
          callback: () => {
            message.success('管理人员信息已更新');
            this.props.dispatch(routerRedux.push('/person/manager/list'));
          },
        });
      }
    });
  };

  handleCertSubmit = () => {
    const { form } = this.formRef.props;
    const {
      match: { params },
    } = this.props;

    const managerId = parseInt(params.id);

    form.validateFieldsAndScroll((err: boolean, values: any) => {
      if (err) {
        return;
      }
      const type = this.props.certType.filter(item => item.id == values.cert_typeId)[0];
      const item = {
        managerId: managerId,
        name: values.cert_name,
        expiredAt: values.cert_expiredAt && values.cert_expiredAt.format('YYYY-MM-DD'),
        remark: values.cert_remark,
        typeId: values.cert_typeId,
        typeName: type.name,
        identityNumber: values.cert_identityNumber,
        ossFile: parseUploadedItem(values.cert_fileList.fileList),
      } as IManagerCert;

      if (this.state.current) {
        // @ts-ignore
        item.id = this.state.current.id;
      }

      this.props.dispatch({
        type: item.id ? 'manager/updateCert' : 'manager/createCert',
        payload: item,
        callback: this.handleCertUpdated,
      });
    });

    form.resetFields();
  };

  handleCertUpdated = () => {
    const obj = {
      certs: {
        certList: this.props.manager.certs,
      },
    };
    this.props.form.setFieldsValue(obj);
    this.setState({ visible: false });
    message.success('管理人员证书信息已更新');
  };

  handleCertCancel = () => {
    this.setState({
      visible: false,
      current: undefined,
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    const {
      submitting,
      assignerPositions,
      certType,
      form: { getFieldDecorator },
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
      <PageHeaderWrapper title="更新管理人员信息">
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
                  },
                ],
              })(
                <Select placeholder="请选择职位">
                  {assignerPositions &&
                    assignerPositions.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
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
            {getFieldDecorator('certs', { initialValue: { certList: [] } })(
              <ManagerCertList
                removeCertItem={this.handleRemoveCertItem}
                showCreateModal={this.handleShowCreateModal}
              />,
            )}
          </Card>

          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
              更新管理人员信息
            </Button>
          </FooterToolbar>
        </Card>

        <Modal
          title="编辑"
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
            current={this.state.current}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ManagerUpdateProps>()(ManagerUpdate);
