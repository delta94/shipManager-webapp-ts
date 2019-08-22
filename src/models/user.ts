import { Effect } from 'dva';

import { getCurrentUser, updateCurrentPassword, updateCurrentUser } from '@/services/user';
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
    *fetchCurrent(_, { call, put }) {
      const response: IAccount = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *updateCurrent({ payload, callback }, { call, put }) {
      yield call(updateCurrentUser, payload);
      const response: IAccount = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (callback) {
        callback();
      }
    },
    *updateCurrentPassword({ payload, callback }, { call }) {
      yield call(updateCurrentPassword, payload);
      if (callback) {
        callback();
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
