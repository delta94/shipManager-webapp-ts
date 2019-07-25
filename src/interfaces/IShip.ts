import ISailor from "./ISailor";
import IShipPayload from "./IShipPayload";

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
  buildAt: Date;
  assembleAt: Date;
  length: number;
  width: number;
  height: number;
  depth: number;
  grossTone: number;
  netTone: number;
  sailors: ISailor[];
  payloads: IShipPayload[];
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

