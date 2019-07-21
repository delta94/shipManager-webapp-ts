import { Alert, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from '@/interfaces/ILogin';
import LoginComponents from '@/components/UserLogin';
import styles from './style.less';

const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  login: StateType;
  submitting: boolean;
}

interface LoginState {
  type: string;
  autoLogin: boolean;
}

export interface FromDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({login, loading}: {
    login: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    login,
    submitting: loading.effects['login/login'],
  }),
)
class Login extends Component<LoginProps, LoginState> {

  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FromDataType) => {
    if (!err) {
      const { dispatch } = this.props;
      const { autoLogin } = this.state;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          rememberMe: autoLogin
        },
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {

    const { login, submitting } = this.props;
    const { status, type: loginType } = login;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <div>
            {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
            )}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm!.validateFields(this.handleSubmit);
              }}
            />
          </div>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="user-login.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
