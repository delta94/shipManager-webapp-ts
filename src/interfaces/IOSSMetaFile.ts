export default interface IOSSMetaFile {
  id: number;
  name: string;
  size: number;
  type: string;
  ossKey: string;
  uploadBy: string;
  uploadAt: string;
  remark: string;
  category: IOSSMetaCategory
}

export type IOSSMetaCategory = "Company" | "Manager"  | "Sailor" | "Ship"

