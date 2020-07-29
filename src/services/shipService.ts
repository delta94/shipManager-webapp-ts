import request from '@/utils/request';
import { IShip, IShipPayload } from '@/interfaces/IShip';
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
  shipBusinessAreaName: "航区类型",
  tone: '载重量（吨）',
  remark: '备注',
}
