import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { ICommonOptionType } from '@/interfaces/ICategory';

export interface IShip {
  id: number;
  name: string;
  carrierIdentifier: string;
  examineIdentifier: string;
  registerIdentifier: string;
  firstRegisterIdentifier: string;
  formerName: string;

  buildIn: string;
  owner: string;
  shareInfo: string;
  harbor: string;
  buildAt: string;
  assembleAt: string;

  length: number;
  width: number;
  height: number;
  depth: number;

  grossTone: number;
  netTone: number;

  remark: string;

  shipTypeId: number;
  shipTypeName: string;

  shipMaterialTypeId: number;
  shipMaterialTypeName: string;

  shipCerts: IShipCert[];
  shipPayloads: IShipPayload[];
  shipMachines: IShipMachine[];
  shipLicenses: IShipLicense[];

  exHostPower: number
}

export interface IShipCert {
  id: number;
  name: string;
  identityNumber: string;
  expiredAt: string;
  issuedAt: string;
  isRemoved: string;
  remark: string;
  shipId: number;
  shipCertTypeId: number;
  shipCertTypeName: string;
  issueDepartmentTypeId: number;
  issueDepartmentTypeName: string;
  ossFiles: IOSSMetaFile[];
}

export interface IShipMachine {
  id: number;
  model: string;
  manufacturer: string;
  power: number;

  shipMachineTypeId: number;
  shipMachineTypeName: string;

  isRemoved: boolean;
  remark: string;
  shipId?: number;
}

export interface IShipPayload {
  id: number;
  tone: number;
  remark: string;
  shipBusinessAreaId: number;
  shipBusinessAreaName: string;
  shipBusinessAreaRemark: string;
  shipId?: number;
}

export interface IShipLicense {
  id: number;
  name: string;
  businessField: string;
  identityNumber: string;
  expiredAt: string;
  issuedAt: string;
  isRemoved?: boolean;
  remark: string;
  shipId?: number;
  shipLicenseTypeId: number;
  shipLicenseTypeName: string;
  issueDepartmentTypeId: number;
  issueDepartmentTypeName: string;
  ossFiles: IOSSMetaFile[];
}

export interface IShipMaterialType extends ICommonOptionType {}
export interface IShipType extends ICommonOptionType {}
export interface IShipCertType extends ICommonOptionType {}
export interface IShipBusinessAreaType extends ICommonOptionType {}
export interface IShipLicenseType extends ICommonOptionType {}
