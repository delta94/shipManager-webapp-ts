import request from '@/utils/request';
import { IManager, IManagerCertType } from '@/interfaces/IManager';
import { PageableData } from '@/interfaces/ITableList';
import ISailor from '@/interfaces/ISailor';

export async function listManagerAssignerPosition(): Promise<IManagerAssignerPosition[]> {
  return request('/api/manager-assigner-positions', {
    method: 'GET',
  });
}

export async function listManagerCertType(): Promise<IManagerCertType[]> {
  return request('/api/manager-cert-types', {
    method: 'GET',
  });
}

export async function addManager(params: any): Promise<IManager> {
  return request('/api/managers', {
    method: 'POST',
    data: params,
  });
}

export async function updateManager(params: any): Promise<IManager> {
  return request('/api/managers', {
    method: 'PUT',
    data: params,
  });
}

export async function updateManagerCert(params: any) {
  return request('/api/manager-certs', {
    method: 'PUT',
    data: params,
  });
}

export async function createManagerCert(params: any) {
  return request('/api/manager-certs', {
    method: 'POST',
    data: params,
  });
}

export async function infoManagerCert(id: number) {
  return request(`/api/manager-certs/${id}`, {
    method: 'GET',
  });
}

export async function deleteManagerCert(id: number) {
  return request(`/api/manager-certs/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteManager(id: number) {
  return request(`/api/managers/${id}`, {
    method: 'DELETE',
  });
}

export async function infoManager(id: number) {
  return request(`/api/managers/${id}`, {
    method: 'GET',
  });
}

export async function listManager(page: number = 0, size: number = 20, extra: object): Promise<PageableData<ISailor>> {
  return await request('/api/managers', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
  })
}
