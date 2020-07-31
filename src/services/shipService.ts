import request from '@/utils/request';
import {IShip, IShipLicense, IShipMachine, IShipPayload} from '@/interfaces/IShip';
import { PageableData } from '@/interfaces/ITableList';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';
import { parsePagination } from '@/utils/parser';

export async function listShip(page: number = 0, size: number = 10, extra: object): Promise<PageableData<IShip>> {
  return await request('/api/ships', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      'isRemoved.equals': false,
      ...extra,
    },
    getResponse: true,
  }).then(({ data, response }) => {
    return {
      list: data,
      pagination: parsePagination(response.headers),
    } as PageableData<IShip>;
  });
}

export async function addShip(data: Partial<IShip>) {
  return request('/api/ships', {
    method: 'POST',
    data: data,
  });
}

export async function infoShip(id: number): Promise<IShip> {
  return request(`/api/ships/${id}`, {
    method: 'GET',
  });
}

export async function deleteShip(id: number): Promise<void> {
  return request(`/api/ships/${id}`, {
    method: 'DELETE',
  });
}

export async function updateShip(data: Partial<IShip>): Promise<IShip> {
  return request(`/api/ships/`, {
    method: 'PUT',
    data: data,
  });
}

export async function listShipCategory(): Promise<Record<ICategory, ICommonOptionType[]>> {
  return request(`/api/ships/category`, {
    method: 'GET',
  });
}

export async function listShipMeta(): Promise<IShip[]> {
  return request(`/api/ships/listMeta`, {
    method: 'GET',
  });
}

export async function deleteShipPayload(id: number): Promise<void> {
  return request(`/api/ship-payloads/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteShipLicense(id: number): Promise<void> {
  return request(`/api/ship-licenses/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteShipMachine(id: number): Promise<void> {
  return request(`/api/ship-machines/${id}`, {
    method: 'DELETE',
  });
}

export async function upsertShipPayload(payload: Partial<IShipPayload>): Promise<void> {
  if (payload.id) {
    return request(`/api/ship-payloads/`, {
      method: 'PUT',
      data: payload,
    });
  } else {
    return request(`/api/ship-payloads/`, {
      method: 'POST',
      data: payload,
    });
  }
}

export async function upsertShipMachine(machine: Partial<IShipMachine>): Promise<void> {
  if (machine.id) {
    return request(`/api/ship-machines/`, {
      method: 'PUT',
      data: machine,
    });
  } else {
    return request(`/api/ship-machines/`, {
      method: 'POST',
      data: machine,
    });
  }
}

export async function upsertShipLicense(license: Partial<IShipLicense>): Promise<void> {
  if (license.id) {
    return request(`/api/ship-licenses/`, {
      method: 'PUT',
      data: license,
    });
  } else {
    return request(`/api/ship-licenses/`, {
      method: 'POST',
      data: license,
    });
  }
}

export const ShipKeyMap = {
  name: '船舶名',
  carrierIdentifier: '船舶识别号',
  examineIdentifier: '船检登记号',
  registerIdentifier: '初次登记号',
  formerName: '曾用名',

  owner: '船舶所有人',
  shareInfo: '船舶共有情况',
  harbor: '船籍港',
  buildAt: '建造完工日期',
  assembleAt: '安放龙骨日期',

  length: '总长 (米)',
  width: '最大船宽 (米)',
  height: '最大船高 (米)',
  depth: '型深 (米)',
  grossTone: '总吨 (吨)',
  netTone: '净吨 (吨)',

  remark: '备注',
  shipTypeName: '船舶类型',
  shipMaterialTypeName: '船舶材质',
};

export const ShipPayloadKeyMap = {
  shipBusinessAreaName: '航区类型',
  tone: '载重量（吨）',
  remark: '备注',
};

export const ShipLicenseKeyMap = {
  name: '名称',
  businessField: '经营范围',
  identityNumber: '营运证书编号',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  shipLicenseTypeName: '营运证书类型',
  issueDepartmentTypeName: '颁发机构',
  ossFiles: '营运证书电子件',
};

export const ShipMachineKeyMap = {
  model: "型号",
  power: "功率（千瓦）",
  machineType: "船机种类",
  remark: "备注",
};
