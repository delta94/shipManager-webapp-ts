import { Effect } from 'dva';

import { getCurrentUser, updateCurrentPassword, updateCurrentUser } from '@/services/userService';
import IAccount from '@/interfaces/IAccount';
import { ImmerReducer } from '@/models/connect';

export interface UserModelState {
  currentUser?: IAccount;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    updateCurrent: Effect;
    updateCurrentPassword: Effect;
  };
  reducers: {
    saveCurrentUser: ImmerReducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
  },

  effects: {
    *fetchCurrent({ callback }, { call, put }) {
      try {
        const response: IAccount = yield call(getCurrentUser);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
        callback(response);
      } catch (e) {
        callback(e);
      }
    },
    *updateCurrent({ payload, callback }, { call, put }) {
      let account: Account = yield call(updateCurrentUser, payload);

      if (account) {
        yield put({
          type: 'saveCurrentUser',
          payload: account,
        });
      }

      if (callback) {
        callback();
      }
    },
    *updateCurrentPassword({ payload, callback }, { call }) {
      try {
        yield call(updateCurrentPassword, payload);
        if (callback) {
          callback();
        }
      } catch (error) {
        if (callback) {
          callback(error);
        }
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
};

export default UserModel;
