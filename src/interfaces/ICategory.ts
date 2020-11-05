export type ICategory =
  | 'IssueDepartmentType'
  | 'CompanyCertType'
  | 'CompanyType'
  | 'ManagerCertType'
  | 'ManagerDutyType'
  | 'ManagerPositionType'
  | 'SailorDutyType'
  | 'SailorCertType'
  | 'ShipType'
  | 'ShipMaterialType'
  | 'ShipBusinessAreaType'
  | 'ShipLicenseType'
  | 'ShipMachineType'
  | 'DocumentCategoryType';

export interface ICommonOptionType {
  id: number;
  name: string;
  remark: string;
}
