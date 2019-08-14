import { AnyAction, Reducer } from 'redux';
import { parse, stringify } from 'qs';

import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { accountLogin, getCurrentUser } from '@/services/user';
import { LoginResult } from '@/interfaces/ILogin';
import IAccount, { IAccountRole } from '@/interfaces/IAccount';
import { setAuthority, updateToken } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export function getPageQuery(): {
  [key: string]: string;
} {
  return parse(window.location.href.split('?')[1]);
}

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: IAccountRole[]
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType
  effects: {
    logout: Effect;
    login: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
    *login({ payload }, { call, put }) {
      const resp1: LoginResult = yield call(accountLogin, payload);

      updateToken(resp1.id_token);

      const resp2: IAccount = yield call(getCurrentUser);

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: resp2.authorities,
        },
      });

      setAuthority(resp2.authorities);

      reloadAuthorized();

      yield put({
        type: 'user/saveCurrentUser',
        payload: resp2,
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
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
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

export default Model;
