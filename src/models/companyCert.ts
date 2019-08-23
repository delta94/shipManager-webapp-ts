import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ICompanyCertType, ICompanyCert } from '@/interfaces/ICompany';

import {
  listCompanyCert,
  addCompanyCert,
  deleteCompanyCert,
  infoCompanyCert,
  updateCompanyCert,
  listCompanyCertType
} from '@/services/company';

import { ImmerReducer } from '@/models/connect';
import { ITableListPagination } from '@/interfaces/ITableList';

export interface CompanyCertModelState {
  data: {
    list: ICompanyCert[];
    pagination: ITableListPagination;
  };
  certificateTypes: ICompanyCertType[];
  target: ICompanyCert | undefined;
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CompanyCertModelType) => T) => T },
) => void;

export interface CompanyCertModelType {
  namespace: string;
  state: CompanyCertModelState;
  effects: {
    fetch: Effect;
    fetchCertificateTypes: Effect;
    create: Effect;
    remove: Effect;
    update: Effect;
    target: Effect;
  };
  reducers: {
    save: ImmerReducer<CompanyCertModelState>;
    removeCompanyCert: ImmerReducer<CompanyCertModelState>;
    updateCompanyCert: ImmerReducer<CompanyCertModelState>;
    addCompanyCert: ImmerReducer<CompanyCertModelState>;
    loadCompanyCert: ImmerReducer<CompanyCertModelState>;
    saveCertificateTypes: ImmerReducer<CompanyCertModelState>;
  };
}

const CompanyCertModel: CompanyCertModelType = {

  namespace: 'companyCert',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    certificateTypes: [],
    target: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(listCompanyCert, payload);
      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1;
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCertificateTypes({ payload }, { call, put }) {
      const response = yield call(listCompanyCertType, payload);

      yield put({
        type: 'saveCertificateTypes',
        payload: response,
      });
    },

    *create({ payload, callback }, { call, put }) {
      const response = yield call(addCompanyCert, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      yield call(deleteCompanyCert, payload);
      yield put({
        type: 'removeManager',
        payload,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call }) {
      yield call(updateCompanyCert, payload);
      if (callback) callback();
    },

    *target({ payload, callback }, { call, put }) {
      const manager = yield call(infoCompanyCert, payload);
      yield put({
        type: 'loadManager',
        payload: manager,
      });

      callback && callback();
    },
  },
  reducers: {
    save(state, action) {
      state.data = action.payload;
    },

    removeCompanyCert(state, action) {
      const { list, pagination } = state.data;
      state.data.list = list.filter(item => item.id !== action.payload);
      state.data.pagination.total = pagination.total - 1;
    },

    updateCompanyCert(state, action) {
      state.target = action.payload;
    },

    addCompanyCert(state, action) {
      const { pagination } = state.data;
      state.data.list.unshift(action.payload);
      state.data.pagination.total = pagination.total + 1;
    },

    loadCompanyCert(state, action) {
      state.target = action.payload;
    },

    saveCertificateTypes(state, action) {
      state.certificateTypes = action.payload;
    },
  },
};

export default CompanyCertModel;
