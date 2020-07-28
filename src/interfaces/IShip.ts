import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { ICommonOptionType } from '@/interfaces/ICategory';

export interface IShip {
  id: number;
  name: string;
  carrierIdentifier: string;
  examineIdentifier: string;
  registerIdentifier: string;
  formerName: string;
  owner: string;
  shareInfo: string;
  harbor: string;
  buildAt: string;
  assembleAt: string;
  length: string;
  width: string;
  height: string;
  depth: string;
  grossTone: string;
  netTone: string;
  remark: string;

  shipTypeId: number;
  shipTypeName: string;

  shipMaterialTypeId: number;
  shipMaterialTypeName: string;

  shipCerts: IShipCert[];
  shipPayloads: IShipPayload[];
  shipHosts: IShipHost[];
  shipGenerators: IShipGenerator[];
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

export interface IShipHost {
  id: string;
  identityNumber: number;
  modelType: string;
  power: string;
  remark: string;
  shipId: number;
}

export interface IShipGenerator {
  id: number;
  identityNumber: number;
  modelType: string;
  power: string;
  remark: string;
  shipId: number;
}

export interface IShipPayload {
  id: number;
  tone: number;
  remark: string;
  shipBusinessAreaId: number;
  shipBusinessAreaName: string;
  shipBusinessAreaRemark: string;
  shipId: number;
}

export interface IShipMaterialType extends ICommonOptionType {}
export interface IShipType extends ICommonOptionType {}
export interface IShipCertType extends ICommonOptionType {}
export interface IShipBusinessAreaType extends ICommonOptionType {}
