import { Effect } from 'dva';

import { getCurrentUser } from '@/services/user';
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
  },

  reducers: {
    saveCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
};

export default UserModel;
