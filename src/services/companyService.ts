import { ICompany } from '@/interfaces/ICompany';
import request from '@/utils/request';

export async function getCompanyInfo(): Promise<ICompany> {
  return await request(`/api/company`, {
    method: 'GET',
  });
}

export async function updateCompanyInfo(company: Partial<ICompany>): Promise<ICompany> {
  return await request(`/api/company`, {
    method: 'PUT',
    data: company,
  });
}

export const CompanyKeyMap = {
  name: '企业名',
  address: '企业地址',
  businessLicenseNumber: '社会信用代码',
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
