import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

import {addShip, infoShip, listShip, listShipMaterial, listShipTypes} from "@/services/ship";
import IShip, {IShipMaterial, IShipType} from "@/interfaces/IShip";

export interface ShipStateType {
  data: {
    list: IShip[],
    pagination: {}
  },
  target?: IShip,
  types: IShipType[],
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
    fetchMaterial: Effect
    add: Effect
    target: Effect
  };
  reducers: {
    save: Reducer<ShipStateType>;
    saveTypes: Reducer<ShipStateType>;
    saveMaterial: Reducer<ShipStateType>;
    loadShip: Reducer<ShipStateType>;
  };
}

const ShipModel: ShipModelType = {
  namespace: 'ship',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    target: undefined,
    types: [],
    materials: []
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

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addShip, payload);
      yield put({
        type: 'save',
        payload: response,
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

    loadShip(state, action) {
      return {
        ...state,
        target: action.payload
      } as ShipStateType
    }
  },
};

export default ShipModel;
