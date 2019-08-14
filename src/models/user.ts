import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getCurrentUser } from '@/services/user';
import IAccount from '@/interfaces/IAccount';

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
    saveCurrentUser: Reducer<UserModelState>;
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
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
