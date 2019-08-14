import { IManager, IManagerAssignerPosition, IManagerCertType } from '@/interfaces/IManager';

import {
  listManagerAssignerPosition,
  listManagerCertType,
  addManager,
  listManager,
  deleteManager,
  createManagerCert,
  infoManagerCert,
  deleteManagerCert,
  infoManager,
  updateManager,
  updateManagerCert,
} from '@/services/manager';

import { ImmerReducer } from '@/models/connect';
import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ITableListPagination } from '@/interfaces/ITableList';

export interface ManagerModelState {
  data: {
    list: IManager[],
    pagination: ITableListPagination
  },
  assignerPositions: IManagerAssignerPosition[],
  certificateTypes: IManagerCertType[],
  target: IManager | undefined
}
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ManagerModelType) => T) => T },
) => void;

export interface ManagerModelType {
  namespace: string;
  state: ManagerModelState;
  effects: {
    fetch: Effect
    fetchCertificateTypes: Effect
    fetchAssignerPositions: Effect
    create: Effect
    remove: Effect
    update: Effect
    target: Effect
    removeCert: Effect
    updateCert: Effect
    createCert: Effect

  };
  reducers: {
    save: ImmerReducer<ManagerModelState>;
    removeManager: ImmerReducer<ManagerModelState>;
    removeManagerCert: ImmerReducer<ManagerModelState>;
    updateManagerCert: ImmerReducer<ManagerModelState>;
    addManagerCert: ImmerReducer<ManagerModelState>;
    loadManager: ImmerReducer<ManagerModelState>;
    saveAssignerPositions: ImmerReducer<ManagerModelState>;
    saveCertificateTypes: ImmerReducer<ManagerModelState>;
  };
}

const MangerModel: ManagerModelType = {

  namespace: 'manager',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 0,
        pageSize: 0,
      },
    },
    assignerPositions: [],
    certificateTypes: [],
    target: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(listManager, payload);
      if (response.pagination) {
        response.pagination.current = response.pagination.current + 1
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchAssignerPositions({ payload }, { call, put }) {
      const response = yield call(listManagerAssignerPosition, payload);

      yield put({
        type: 'saveAssignerPositions',
        payload: response,
      });
    },

    *fetchCertificateTypes({ payload }, { call, put }) {
      const response = yield call(listManagerCertType, payload);

      yield put({
        type: 'saveCertificateTypes',
        payload: response,
      });
    },

    *create({ payload, callback }, { call, put }) {
      const response = yield call(addManager, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      yield call(deleteManager, payload);
      yield put({
        type: 'removeManager',
        payload,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call }) {
      yield call(updateManager, payload);
      if (callback) callback();
    },

    *removeCert({ payload, callback }, { call, put }) {
      yield call(deleteManagerCert, payload);
      yield put({
        type: 'removeManagerCert',
        payload,
      });
      if (callback) callback(payload);
    },

    *createCert({ payload, callback }, { call, put }) {
      const response = yield call(createManagerCert, payload);
      const detailsResponse = yield call(infoManagerCert, response.id);
      yield put({
        type: 'addManagerCert',
        payload: detailsResponse,
      });
      if (callback) callback(detailsResponse);
    },

    *updateCert({ payload, callback }, { call, put }) {
      const response = yield call(updateManagerCert, payload);
      yield put({
        type: 'updateManagerCert',
        payload: response,
      });
      if (callback) callback(response);
    },

    *target({ payload, callback }, { call, put }) {
      const manager = yield call(infoManager, payload);
      yield put({
        type: 'loadManager',
        payload: manager,
      });

      callback && callback()
    },
  },
  reducers: {
    save(state, action) {
      state.data = action.payload
    },

    removeManager(state, action) {
      const { list, pagination } = state.data;
      state.data.list = list.filter(item => item.id !== action.payload);
      state.data.pagination.total = pagination.total - 1;
    },

    removeManagerCert(state, action) {
      const { target } = state;
      const certId = action.payload;
      state.target!.certs = target!.certs.filter(item => item.id !== certId);
    },

    updateManagerCert(state, action) {
      const { target } = state;
      const updatedCert = action.payload;
      const certs = target!.certs.filter(item => item.id !== updatedCert.id);
      certs.push(updatedCert);
      state.target!.certs = certs;
    },

    addManagerCert(state, action) {
      const { target } = state;
      const newCert = action.payload;
      state.target!.certs = target!.certs.concat(newCert);
    },

    loadManager(state, action) {
      state.target = action.payload;
    },

    saveAssignerPositions(state, action) {
      state.assignerPositions = action.payload;
    },

    saveCertificateTypes(state, action) {
      state.certificateTypes = action.payload;
    },
  },
};

export default MangerModel;
