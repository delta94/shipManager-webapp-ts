import request from '@/utils/request';
import { IManager, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import { PageableData } from '@/interfaces/ITableList';
import { parsePagination } from '@/utils/parser';

export async function listManager(page: number = 1, size: number = 20, extra: any): Promise<PageableData<IManager>> {
  return await request('/api/managers', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
    getResponse: true,
  }).then(({ data, response }) => {
    return {
      list: data,
      pagination: parsePagination(response.headers),
    } as PageableData<IManager>;
  });
}

export async function createManager(manager: IManager) {
  return request(`/api/managers/`, {
    method: 'POST',
    data: manager
  });
}

export async function updateManager(manager: IManager) {
  return request(`/api/managers/`, {
    method: 'PUT',
    data: manager
  });
}

export async function deleteManager(id: number) {
  return request(`/api/managers/${id}`, {
    method: 'DELETE',
  });
}

export async function infoManager(id: number): Promise<IManager> {
  return request(`/api/managers/${id}`, {
    method: 'GET',
  });
}

export async function getManagerPositionType(): Promise<IManagerPositionType[]> {
  return request('/api/manager-position-types', {
    method: 'GET',
  });
}

export async function getManagerDutyType(): Promise<IManagerDutyType[]> {
  return request('/api/manager-duty-types', {
    method: 'GET',
  });
}

export const ManagerKeyMap = {
  name: '姓名',
  identityNumber: '身份证号码',
  educationLevel: '学历',
  mobile: '联系方式',
  remark: '备注',
  managerDutyName: '人员职位',
  managerPositionName: '人员类型',
};
