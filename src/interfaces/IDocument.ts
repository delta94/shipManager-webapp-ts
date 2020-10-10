export interface IDocument {
  id: number;
  name: string;
  templatePath: string;
  templateFormMeta: string;
  size: number;
  mimeType: string;
  isRemoved: boolean;
  remark: string;
  uploadBy: string;
  updateAt: string;
  documentCategoryTypeId: number;
  documentCategoryTypeName: string;
}

export interface ITemplateDTO {
  variable?: Map<string, object>
  fileName?: string
  variables?: Array<Map<string, object>>
  plural?: boolean

}
