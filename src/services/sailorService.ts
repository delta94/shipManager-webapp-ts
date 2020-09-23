import request from '@/utils/request';
import { ISailor } from '@/interfaces/ISailor';
import { PageableData } from '@/interfaces/ITableList';
import { parsePagination } from '@/utils/parser';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';

export async function listSailor(page: number = 1, size: number = 20, extra: any): Promise<PageableData<ISailor>> {
  return await request('/api/sailors', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      'isActive.equals': true,
      sort: 'id,desc',
      ...extra,
    },
    getResponse: true,
  }).then(({ data, response }) => {
    return {
      list: data,
      pagination: parsePagination(response.headers),
    } as PageableData<ISailor>;
  });
}

export async function createSailor(sailor: ISailor) {
  return request(`/api/sailors/`, {
    method: 'POST',
    data: sailor,
  });
}

export async function updateSailor(sailor: ISailor) {
  return request(`/api/sailors/`, {
    method: 'PUT',
    data: sailor,
  });
}

export async function deleteSailor(id: number) {
  return request(`/api/sailors/${id}`, {
    method: 'DELETE',
  });
}

export async function infoSailor(id: number): Promise<ISailor> {
  return request(`/api/sailors/${id}`, {
    method: 'GET',
  });
}

export async function unlinkSailor(id: number) {
  return request(`/api/sailors/unlink/${id}`, {
    method: 'POST',
  });
}

export async function listSailorCategory(): Promise<Record<ICategory, ICommonOptionType[]>> {
  return request(`/api/sailors/category`, {
    method: 'GET',
  });
}

export const SailorKeyMap = {
  name: '姓名',
  identityNumber: '身份证号码',
  sailorDutyTypeName: '担任职位',
  licenseNumber: '适任证书编号',

  gender: '性别', // 0-男性; 1-女性'
  birthDate: '出生日期',

  contractWorkAt: '合同生效日期',
  contractExpiryAt: '合同到期日期',

  emergencyContactName: '紧急联系人姓名',
  emergencyContactMobile: '紧急联系人电话',

  isAdvanced: '是否高级船员',
  region: '籍贯',
  mobile: '联系方式',
  address: '居住地',

  remark: '备注信息',
  isActive: '是否有效',
  shipName: '所属船舶',
};
