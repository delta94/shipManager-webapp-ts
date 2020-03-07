import { UploadFile } from "antd/lib/upload/interface";

export interface ICompanySheet {
  id: number;
  name: string;
  isTemplate: boolean;
  fileSize: number;
  ossFile: string;
  uploader: string;
  updateAt: string;
  typeName: string;
  typeId: number;
  remark: string;
  bindings: string;
  ex_bindings?: Binding[];
  ex_ossFile?: UploadFile[]
}

export interface ICompanySheetType {
  id: number;
  name: string;
  remark: string;
  icon: string;
}

export interface Binding {
  name: string;
  desc: string;
  required: boolean;
  global: boolean;
  multiple: boolean;
  default: any;
}

export interface ICompanyTemplateSheet {}
