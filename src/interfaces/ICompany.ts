import { UploadFile } from 'antd/lib/upload/interface';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';

export interface ICompany {
  id: number;
  name: string; //'企业名称'
  address: string; //'企业地址'
  businessLicenseNumber: string; //'工商执照号'
  registeredCapital: number; //'注册资本/万元'
  legalPerson: string; //'法人代表'
  phone: string; //'法人代表'
  businessScope: string; //'业务范围'
  fax: string; //'业务范围'
  taxRegistrationNumber: number; //'税务登记号'
  postcode: string; //'邮政编码'
  englishName: string; //'英文名称'
  district: string; //'所属行政区域'
  companyTypeId: number; //'企业类型名称id'
  companyTypeName: string; //'企业类型名称'
}

export interface ICompanyCert {
  id: number;
  name: string;
  identityNumber: string;
  expiredAt: string;
  issuedAt: string;
  remark: string;
  companyCertTypeId: number;
  companyCertTypeName: string;
  issueDepartmentTypeId: number;
  issueDepartmentTypeName: string;
  ossFiles: IOSSMetaFile[];
}

export interface ICompanyCertType {
  id: number;
  name: string;
  remark: string;
}

export interface ICompanyType {
  id: number;
  name: string;
  remark: string;
}

export interface ICompanyLicense {
  id: number;
  name: string;
  identityNumber: string;
  remark: string;
  ossFile: string;
  expireAt: string;
  ex_ossFile?: UploadFile[];
}
