import IOSSMetaFile from '@/interfaces/IOSSMetaFile';

export interface IManager {
  id: number;
  name: string;
  identityNumber: string;
  educationLevel: string;
  mobile: string;
  remark: string;
  managerDutyId: number;
  managerDutyName: string;
  managerPositionId: number;
  managerPositionName: string;
  managerCerts: IManagerCert[];
}

export interface IManagerCert {
  id: number;
  name: string;
  identityNumber: string;
  expiredAt: string;
  issuedAt: string;
  remark: string;
  managerId: number;
  managerCertTypeId: number;
  managerCertTypeName: string;
  issueDepartmentTypeId: number;
  issueDepartmentTypeName: string;
  ossFiles: IOSSMetaFile[];
  isRemoved: boolean;
}

export interface IManagerCertType {
  id: number;
  name: string;
  remark: string;
}

export interface IManagerPositionType {
  id: number;
  name: string;
  remark: string;
}

export interface IManagerDutyType {
  id: number;
  name: string;
  remark: string;
}
