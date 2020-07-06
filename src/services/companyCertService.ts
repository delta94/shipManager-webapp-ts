import { ICompanyCert, ICompanyCertType } from '@/interfaces/ICompany';
import request from '@/utils/request';

export async function getCompanyCertInfo(): Promise<ICompanyCert[]> {
  return await request(`/api/company-certs/`, {
    method: 'GET',
  });
}

export async function getCompanyCertType(): Promise<ICompanyCertType[]> {
  return await request(`/api/company-cert-types`, {
    method: 'GET',
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
