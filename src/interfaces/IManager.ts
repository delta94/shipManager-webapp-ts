export interface IManager {
  id: number;
  name: string;
  dept: string;
  position: string;
  identityNumber: string;
  mobile: string;
  phone: string;
  certs: IManagerCert[];
  assignerName: string;
  assignerId: number;
}

export interface IManagerCert {
  id: number;
  name: string;
  identityNumber: string;
  expiredAt: Date;
  ossFile: string;
  remark: string;
  managerId: number;
  typeName: string;
  typeId: number;
}

export interface IManagerCertType {
  id: number;
  name: string;
  remark: string;
  icon: string;
}

export interface IManagerAssignerPosition {
  id: number;
  name: string;
  remark: string;
}
