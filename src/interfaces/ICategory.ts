export enum ICategory {
  IssueDepartmentType = 'IssueDepartmentType',

  CompanyCertType = 'CompanyCertType',
  CompanyType = 'CompanyType',

  ManagerCertType = 'ManagerCertType',
  ManagerDutyType = 'ManagerDutyType',
  ManagerPositionType = 'ManagerPositionType',

  SailorDutyType = 'SailorDutyType',
  SailorCertType = 'SailorCertType',

  ShipType = 'ShipType',
  ShipMaterialType = 'ShipMaterialType',
  ShipBusinessAreaType = 'ShipBusinessAreaType',
  ShipLicenseType = 'ShipLicenseType',
}

export interface ICommonOptionType {
  id: number;
  name: string;
  remark: string;
}
