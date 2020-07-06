import { ICompany, ICompanyType } from '@/interfaces/ICompany';
import request from '@/utils/request';

export async function getCompanyInfo(id: number = 1): Promise<ICompany> {
  return await request(`/api/companies/${id}`, {
    method: 'GET',
  });
}

export async function updateCompanyInfo(company: Partial<ICompany>): Promise<ICompany> {
  return await request(`/api/companies`, {
    method: 'PUT',
    data: company,
  });
}

export async function getCompanyType(): Promise<ICompanyType[]> {
  return await request(`/api/company-types`, {
    method: 'GET',
  });
}

export const CompanyKeyMap = {
  name: '企业名',
  address: '企业地址',
  businessLicenseNumber: '工商执照号',
  registeredCapital: '注册资本/万元',
  legalPerson: '法人代表',
  phone: '联系电话',
  businessScope: '业务范围',
  fax: '传真电话',
  taxRegistrationNumber: '税务登记号',
  postcode: '邮政编码',
  englishName: '英文名称',
  district: '所属行政区域',
  companyTypeName: '企业类型',
};
