import request from '@/utils/request';
import { IManagerCert } from '@/interfaces/IManager';

export async function getManagerCertInfo(): Promise<IManagerCert[]> {
  return await request(`/api/manager-certs/`, {
    method: 'GET',
  });
}

export async function infoManagerCertInfo(id: number): Promise<IManagerCert> {
  return await request(`/api/manager-certs/${id}`, {
    method: 'GET',
  });
}

export async function createManagerCert(cert: IManagerCert): Promise<IManagerCert> {
  return await request(`/api/manager-certs/`, {
    method: 'POST',
    data: cert,
  });
}

export async function updateManagerCert(cert: IManagerCert): Promise<IManagerCert> {
  return await request(`/api/manager-certs/`, {
    method: 'PUT',
    data: cert,
  });
}

export async function deleteManagerCert(id: number): Promise<IManagerCert> {
  return await request(`/api/manager-certs/${id}`, {
    method: 'DELETE',
  });
}

export const ManagerCertKeyMap = {
  name: '名称',
  identityNumber: '证书编号',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  managerCertTypeName: '证书类型',
  issueDepartmentTypeName: '颁发机构',
  ossFiles: '证书电子件',
};
