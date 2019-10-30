import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ICompanySheet, ICompanySheetType } from '@/interfaces/ICompanySheet';

import {
  listCompanyCommonSheets,
  listCompanyTemplateSheets,
  listCompanySheetTypes,
  deleteCompanySheet
} from '@/services/sheet';

import { ImmerReducer } from '@/models/connect';
import { ITableListPagination } from '@/interfaces/ITableList';

export interface CompanySheetState {
  template_sheet: {
    list: ICompanySheet[];
    pagination: ITableListPagination;
  };
  common_sheet: {
    list: ICompanySheet[];
    pagination: ITableListPagination;
  };
  types: ICompanySheetType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CompanySheetState) => T) => T },
) => void;

export interface CompanySheetModelType {
  namespace: string;
  state: CompanySheetState;
  effects: {
    fetchCommonSheet: Effect;
    fetchTemplateSheet: Effect;
    fetchSheetTypes: Effect;
    removeSheet: Effect;
  };
  reducers: {
    updateCommonSheet: ImmerReducer<CompanySheetState>;
    updateTemplateSheet: ImmerReducer<CompanySheetState>;
    updateSheetTypes: ImmerReducer<CompanySheetState>;
  };
}

const CompanySheetModel: CompanySheetModelType = {
  namespace: 'companySheet',

  state: {
    common_sheet: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    template_sheet: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    types: [],
  },

  effects: {
    *fetchCommonSheet({ payload }, { call, put }) {
      const response = yield call(listCompanyCommonSheets, payload);

      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1;
      }

      yield put({
        type: 'updateCommonSheet',
        payload: response,
      });
    },

    *fetchTemplateSheet({ payload }, { call, put }) {
      const response = yield call(listCompanyTemplateSheets, payload);

      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1;
      }

      yield put({
        type: 'updateTemplateSheet',
        payload: response,
      });
    },

    *fetchSheetTypes({ payload }, { call, put }) {
      const response = yield call(listCompanySheetTypes, payload);

      yield put({
        type: 'updateSheetTypes',
        payload: response,
      });
    },
    *removeSheet({ payload, callback }, { call }) {
      const response = yield call(deleteCompanySheet, payload);
      if (callback) callback();
    },
  },
  reducers: {
    updateTemplateSheet(state, action) {
      state.template_sheet = action.payload;
    },
    updateCommonSheet(state, action) {
      state.common_sheet = action.payload;
    },
    updateSheetTypes(state, action) {
      state.types = action.payload;
    },
  },
};

export default CompanySheetModel;
