import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {
  addShip, infoShip, listShip, deleteShip, listShipMaterial, listShipTypes,
  listShipBusinessAreas
} from "@/services/ship";
import IShip, {IShipBusinessArea, IShipMaterial, IShipType} from "@/interfaces/IShip";
import {ITableListPagination} from "@/interfaces/ITableList";

export interface ShipStateType {
  data: {
    list: IShip[],
    pagination: ITableListPagination
  },
  target?: IShip,
  types: IShipType[],
  businessAreas: IShipBusinessArea[],
  materials: IShipMaterial[]
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ShipStateType) => T) => T },
) => void;

export interface ShipModelType {
  namespace: string;
  state: ShipStateType;
  effects: {
    fetch: Effect
    fetchTypes: Effect
    fetchBusinessAreas: Effect
    fetchMaterial: Effect
    create: Effect
    remove: Effect
    target: Effect
  };
  reducers: {
    save: Reducer<ShipStateType>;
    saveTypes: Reducer<ShipStateType>;
    saveBusinessAreas: Reducer<ShipStateType>
    saveMaterial: Reducer<ShipStateType>;
    loadShip: Reducer<ShipStateType>;
    removeShip: Reducer<ShipStateType>
  };
}

const ShipModel: ShipModelType = {
  namespace: 'ship',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0
      }
    },
    target: undefined,
    types: [],
    materials: [],
    businessAreas: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(listShip, payload);

      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1
      }

      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchTypes({ payload }, { call , put }) {
      const response = yield call(listShipTypes, payload);

      yield put({
        type: 'saveTypes',
        payload: response,
      });
    },

    *fetchMaterial({ payload }, { call, put }) {
      const response = yield call(listShipMaterial, payload);

      yield put({
        type: 'saveMaterial',
        payload: response,
      });
    },

    *fetchBusinessAreas({ payload }, { call, put }) {
      const response = yield call(listShipBusinessAreas, payload);

      yield put({
        type: 'saveBusinessAreas',
        payload: response,
      });
    },

    *create({ payload, callback }, { call, put }) {
      const response = yield call(addShip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteShip, payload);
      yield put({
        type: 'removeShip',
        payload: response
      });
      if (callback) callback();
    },

    *target({ payload, callback }, { call, put }) {
      let ship = yield call(infoShip, payload);
      yield put({
        type: 'loadShip',
        payload: ship,
      });

      callback && callback()
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      } as ShipStateType
    },

    saveTypes(state, action) {
      return {
        ...state,
        types: action.payload,
      } as ShipStateType
    },

    saveMaterial(state, action) {
      return {
        ...state,
        materials: action.payload,
      } as ShipStateType
    },

    saveBusinessAreas(state, action) {
      return {
        ...state,
        businessAreas: action.payload,
      } as ShipStateType
    },

    loadShip(state, action) {
      return {
        ...state,
        target: action.payload
      } as ShipStateType
    },

    removeShip(state, action) {
      // @ts-ignore
      let { list: ship, pagination } = state.data;
      return {
        ...state,
        data: {
          list: ship.filter(item => item != action.payload),
          pagination: {
            total: pagination.total - 1,
            pageSize: pagination.pageSize,
            current: pagination.current
          }
        }
      } as ShipStateType
    }
  },
};

export default ShipModel;
