import { UploadFile } from "antd/lib/upload/interface";

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
  ex_certFile?: UploadFile[]
}

export interface ISailorPosition {
  id: number;
  name: string;
  remark: string;
}
