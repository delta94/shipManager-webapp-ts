import { ISailorCert } from '@/interfaces/ISailor';
import request from '@/utils/request';

export async function infoSailorCertInfo(id: number): Promise<ISailorCert> {
  return await request(`/api/sailor-certs/${id}`, {
    method: 'GET',
  });
}

export async function createSailorCert(cert: ISailorCert): Promise<ISailorCert> {
  return await request(`/api/sailor-certs/`, {
    method: 'POST',
    data: cert,
  });
}

export async function updateSailorCert(cert: ISailorCert): Promise<ISailorCert> {
  return await request(`/api/sailor-certs/`, {
    method: 'PUT',
    data: cert,
  });
}

export async function deleteSailorCert(id: string): Promise<ISailorCert> {
  return await request(`/api/sailor-certs/${id}`, {
    method: 'DELETE',
  });
}

export const SailorCertKeyMap = {
  name: '名称',
  identityNumber: '证书编号',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  sailorCertTypeName: '证书类型',
  issueDepartmentTypeName: '颁发机构',
  ossFiles: '证书电子件',
};
