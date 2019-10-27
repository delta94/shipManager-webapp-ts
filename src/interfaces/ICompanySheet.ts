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
}

export interface ICompanySheetType {
  id: number;
  name: string;
  remark: string;
  icon: string;
}
