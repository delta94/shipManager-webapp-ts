import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ICompanyLicense } from '@/interfaces/ICompany';

import {
  listCompanyLicense,
  addCompanyLicense,
  deleteCompanyLicense,
  infoCompanyLicense,
  updateCompanyLicense,
} from '@/services/company';

import { ImmerReducer } from '@/models/connect';
import { ITableListPagination } from '@/interfaces/ITableList';

export interface CompanyLicenseModelState {
  data: {
    list: ICompanyLicense[];
    pagination: ITableListPagination;
  };
  target: ICompanyLicense | undefined;
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CompanyLicenseModelType) => T) => T },
) => void;

export interface CompanyLicenseModelType {
  namespace: string;
  state: CompanyLicenseModelState;
  effects: {
    fetch: Effect;
    create: Effect;
    remove: Effect;
    update: Effect;
    target: Effect;
  };
  reducers: {
    save: ImmerReducer<CompanyLicenseModelState>;
    removeCompanyLicense: ImmerReducer<CompanyLicenseModelState>;
    updateCompanyLicense: ImmerReducer<CompanyLicenseModelState>;
    addCompanyLicense: ImmerReducer<CompanyLicenseModelState>;
    loadCompanyLicense: ImmerReducer<CompanyLicenseModelState>;
  };
}

const CompanyLicenseModel: CompanyLicenseModelType = {
  namespace: 'companyLicense',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    target: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(listCompanyLicense, payload);
      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1;
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *create({ payload, callback }, { call, put }) {
      const response = yield call(addCompanyLicense, payload);
      yield put({
        type: 'addCompanyLicense',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      yield call(deleteCompanyLicense, payload);
      yield put({
        type: 'removeCompanyLicense',
        payload,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call }) {
      yield call(updateCompanyLicense, payload);
      if (callback) callback();
    },

    *target({ payload, callback }, { call, put }) {
      const cert = yield call(infoCompanyLicense, payload);
      yield put({
        type: 'loadCompanyLicense',
        payload: cert,
      });

      callback && callback();
    },
  },
  reducers: {
    save(state, action) {
      state.data = action.payload;
    },

    removeCompanyLicense(state, action) {
      const { list, pagination } = state.data;
      state.data.list = list.filter(item => item.id !== action.payload);
      state.data.pagination.total = pagination.total - 1;
    },

    updateCompanyLicense(state, action) {
      state.target = action.payload;
    },

    addCompanyLicense(state, action) {
      const { pagination } = state.data;
      state.data.list.unshift(action.payload);
      state.data.pagination.total = pagination.total + 1;
    },

    loadCompanyLicense(state, action) {
      state.target = action.payload;
    },
  },
};

export default CompanyLicenseModel;
