import { Moment } from 'moment';
import ISailor from './ISailor';
import IShipPayload from './IShipPayload';

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

export const ShipFieldLabels = {
  name: '船舶名',
  carrierIdentifier: '船舶识别号',
  owner: '船舶所有人',
  shareInfo: '船舶共有情况',
  harbor: '船籍港',
  formerName: '曾用名',
  registerIdentifier: '初次登记号',
  examineIdentifier: '船检登记号',
  material: '船舶材质',
  buildAt: '建造完工日期',
  assembleAt: '安放龙骨日期',
  type: '船舶类型',
  power: '发动机功率',
  grossTone: '总吨位 (吨)',
  netTone: '净吨位 (吨)',
  length: '船身长 (米)',
  width: '船身宽 (米)',
  depth: '船身深 (米)',
  height: '船身高 (米)',
  sailorCount: '船员人数',
};
