import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { accountLogin, getCurrentUser } from '@/services/userService';
import { LoginResult } from '@/interfaces/ILogin';
import IAccount, { IAccountRole } from '@/interfaces/IAccount';
import { setAuthority, updateToken } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import {getPageQuery} from "@/utils/utils";

export interface LoginStateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: IAccountRole[];
}

export interface LoginModelType {
  namespace: string;
  state: LoginStateType;
  effects: {
    logout: Effect;
    login: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {

    *login({ payload }, { call, put }) {
      try {
        const resp1: LoginResult = yield call(accountLogin, payload);

        updateToken(resp1.id_token);

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: resp1.user.authorities,
          },
        });

        setAuthority(resp1.user.authorities);

        reloadAuthorized();

        yield put({
          type: 'user/saveCurrentUser',
          payload: resp1.user,
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();

        let { redirect } = params as { redirect: string };

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      } catch (e) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error'
          },
        });
        console.error(e)
      }
    },

    *logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        reloadAuthorized();
        updateToken('');
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default LoginModel;
