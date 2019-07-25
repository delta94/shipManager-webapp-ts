
export default interface ISailor {
  id: number;
  name: string;
  identityNumber: string;
  isAdvanced: boolean;
  mobile: string;
  address: string;
  certFile: string;
  positionName: string;
  positionId: number;
  shipName: string;
  shipId: number;
}

export interface ISailorPosition {
  id: number;
  name: string;
  remark: string;
}
