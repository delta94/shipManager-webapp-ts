import ISailor from './ISailor';
import IShipPayload from './IShipPayload';
import { Moment } from 'moment';

export default interface IShip {
  id: number;
  name: string;
  formerName: string;
  owner: string;
  carrierIdentifier: string;
  examineIdentifier: string;
  registerIdentifier: string;
  shareInfo: string;
  harbor: string;
  buildAt: Date | Moment | string;
  assembleAt: Date | Moment | string;
  length: number;
  width: number;
  height: number;
  depth: number;
  grossTone: number;
  netTone: number;
  sailors: Partial<ISailor>[];
  payloads: Partial<IShipPayload>[];
  certificates: Partial<IShipCertificate>[];
  sailorCount: number;
  typeName: string;
  typeId: number;
  materialName: string;
  materialId: number;
}

export interface IShipType {
  id: number;
  name: string;
  remark: string;
}

export interface IShipMaterial {
  id: number;
  name: string;
  remark: string;
}

export interface IShipBusinessArea {
  id: number;
  name: string;
  remark: string;
}

export interface IShipMeta {
  id: number;
  name: string;
}

export interface IShipCertType {
  id: number;
  name: string;
  remark: string;
  icon: string;
}

export interface IShipCertificate {
  id: number;
  identityNumber: number;
  expiredAt: string;
  ossFile: string;
  remark: string;
  issueBy: string;
  shipId: number;
  typeId: number;
  typeName: string;
}
