import { ICompanyCert } from '@/interfaces/ICompany';
import request from '@/utils/request';

export async function getCompanyCertInfo(): Promise<ICompanyCert[]> {
  return await request(`/api/company-certs/`, {
    method: 'GET',
  });
}

export async function infoCompanyCertInfo(id: number): Promise<ICompanyCert> {
  return await request(`/api/company-certs/${id}`, {
    method: 'GET',
  });
}

export async function createCompanyCert(cert: ICompanyCert): Promise<ICompanyCert> {
  return await request(`/api/company-certs/`, {
    method: 'POST',
    data: cert,
  });
}

export async function updateCompanyCert(cert: ICompanyCert): Promise<ICompanyCert> {
  return await request(`/api/company-certs/`, {
    method: 'PUT',
    data: cert,
  });
}

export async function deleteCompanyCert(id: number): Promise<ICompanyCert> {
  return await request(`/api/company-certs/${id}`, {
    method: 'DELETE',
  });
}

export const CompanyCertKeyMap = {
  name: '名称',
  identityNumber: '证书编号',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  companyCertTypeName: '证书类型',
  issueDepartmentTypeName: '颁发机构',
  ossFiles: '证书电子件',
};
