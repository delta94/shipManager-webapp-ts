import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ImmerReducer } from './connect.d';

import {
  addSailor,
  listSailor,
  deleteSailor,
  listSailorPosition,
  infoSailor,
  updateSailor,
} from '@/services/sailor';

import { ITableListPagination } from '@/interfaces/ITableList';
import ISailor, { ISailorPosition } from '@/interfaces/ISailor';
import { IShipMeta } from '@/interfaces/IShip';
import { listShipMeta } from '@/services/ship';

export interface SailorModelState {
  data: {
    list: ISailor[],
    pagination: ITableListPagination
  },
  positions: ISailorPosition[],
  shipListMeta: IShipMeta[],
  target?: ISailor,
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: SailorModelType) => T) => T },
) => void;

export interface SailorModelType {
  namespace: string;
  state: SailorModelState;
  effects: {
    fetch: Effect
    create: Effect
    update: Effect
    remove: Effect
    target: Effect
    fetchShipMetaList: Effect
    fetchPositionTypes: Effect
  };
  reducers: {
    save: ImmerReducer<SailorModelState>;
    loadSailor: ImmerReducer<SailorModelState>;
    saveTypes: ImmerReducer<SailorModelState>;
    saveShipMeta: ImmerReducer<SailorModelState>;
    removeSailor: ImmerReducer<SailorModelState>;
    targetSailor: ImmerReducer<SailorModelState>;
  };
}

const SailorModel: SailorModelType = {

  namespace: 'sailor',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    shipListMeta: [],
    positions: [],
    target: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(listSailor, payload);

      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1
      }

      yield put({
        type: 'save',
        payload: response,
      });
    },

    *target({ payload, callback }, { call, put }) {
      const sailor = yield call(infoSailor, payload);
      yield put({
        type: 'targetSailor',
        payload: sailor,
      });
      callback && callback()
    },

    *update({ payload, callback }, { call }) {
      yield call(updateSailor, payload);
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      yield call(deleteSailor, payload);
      yield put({
        type: 'removeSailor',
        payload,
      });
      if (callback) callback();
    },

    *create({ payload, callback }, { call }) {
      yield call(addSailor, payload);
      if (callback) callback();
    },

    *fetchShipMetaList({ payload }, { call, put }) {
      const response = yield call(listShipMeta, payload);

      yield put({
        type: 'saveShipMeta',
        payload: response,
      });
    },

    *fetchPositionTypes({ payload }, { call, put }) {
      const response = yield call(listSailorPosition, payload);

      yield put({
        type: 'saveTypes',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      } as SailorModelState
    },

    loadSailor(state, action) {
      return {
        ...state,
        target: action.payload,
      } as SailorModelState
    },

    removeSailor(state, action) {
      const { list, pagination } = state.data;
      state.data.list = list.filter(item => item.id !== action.payload);
      state.data.pagination = {
        total: pagination.total - 1,
        pageSize: pagination.pageSize,
        current: pagination.current,
      }
    },

    saveTypes(state, action) {
      return {
        ...state,
        positions: action.payload,
      } as SailorModelState
    },

    saveShipMeta(state, action) {
      return {
        ...state,
        shipListMeta: action.payload,
      } as SailorModelState
    },

    targetSailor(state, action) {
      state.target = action.payload
    },
  },
};

export default SailorModel;
