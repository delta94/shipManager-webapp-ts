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
  id: number | string;
  name: string;
  identityNumber: string;
  expiredAt: string;

  remark: string;
  managerId: number;
  typeName: string;
  typeId: number;

  ossFile?: string;
  icon?: string,
  managerName?: string
  typeRemark?: string
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
