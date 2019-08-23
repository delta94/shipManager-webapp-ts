import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';
import { List, message } from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import EditPasswordForm from '@/pages/setting/personal/components/EditPasswordForm';
import IAccount from '@/interfaces/IAccount';
import { UserModelState } from '@/models/user';

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

interface SecurityViewProps {
  currentUser?: IAccount;
  dispatch: Dispatch<any>;
}

interface SecurityViewState {
  visible: boolean;
}

@connect(({ user }: { user: UserModelState }) => ({
  currentUser: user.currentUser,
}))
class SecurityView extends Component<SecurityViewProps, SecurityViewState> {
  formRef: any;

  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      if (values.newPassword !== values.newPasswordRepeated) {
        return;
      }

      this.props.dispatch({
        type: 'user/updateCurrentPassword',
        payload: values,
        callback: () => {
          message.success('密码修改成功');
        },
      });

      form.resetFields();
      this.setState({ visible: false });
    });
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a key="Modify" onClick={this.showModal}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    const data = this.getData();
    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <EditPasswordForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default SecurityView;
