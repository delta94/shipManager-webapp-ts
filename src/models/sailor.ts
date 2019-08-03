import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {
  listSailor, listSailorPosition
} from "@/services/sailor";

import {ITableListPagination} from "@/interfaces/ITableList";
import ISailor, {ISailorPosition} from "@/interfaces/ISailor";
import {IShipMeta} from "@/interfaces/IShip";
import {listShipMeta} from "@/services/ship";

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
    fetchShipMetaList: Effect
    fetchPositionTypes: Effect
  };
  reducers: {
    save: Reducer<SailorModelState>;
    loadSailor: Reducer<SailorModelState>;
    saveTypes: Reducer<SailorModelState>;
    saveShipMeta: Reducer<SailorModelState>;
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
        pageSize: 0
      }
    },
    shipListMeta: [],
    positions: [],
    target: undefined
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let response = yield call(listSailor, payload);

      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1
      }

      yield put({
        type: 'save',
        payload: response,
      });
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
        target: action.payload
      } as SailorModelState
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
        shipListMeta: action.payload
      } as SailorModelState
    }
  },
};

export default SailorModel;
