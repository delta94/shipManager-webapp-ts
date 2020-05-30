import { UploadFile } from "antd/lib/upload/interface";

export interface ICompany {
  id: number;
  name: string;
  owner: string;
  authorisedCapital: number;
  address: string;
  registerDate: string;
}

export interface ICompanyCert {
  id: number;
  name: string;
  identityNumber: string;
  expiredAt: string;
  ossFile: string;
  remark: string;
  typeName: string;
  typeId: number;
  ex_ossFile?: UploadFile[]
}

export interface ICompanyCertType {
  id: number;
  name: string;
  remark: string;
  icon: string;
}

export interface ICompanyLicense {
  id: number;
  name: string;
  identityNumber: string;
  remark: string;
  ossFile: string;
  expireAt: string;
  ex_ossFile?: UploadFile[]
}
