import IOSSMetaFile from '@/interfaces/IOSSMetaFile';

export interface ISailor {
  id: number;
  name: string;

  shipId: string;
  shipName: string;

  identityNumber: string;
  licenseNumber: string;
  gender: number;
  birthDate: string;

  contractWorkAt: string;
  contractExpiryAt: string;

  isAdvanced: boolean;
  region: string;
  mobile: string;
  address: string;
  remark: string;
  isActive: boolean;

  sailorDutyTypeId: number;
  sailorDutyTypeName: string;

  emergencyContactName: string;
  emergencyContactMobile: string;

  sailorCerts: ISailorCert[] ;
}

export interface ISailorDutyType {
  id: number;
  name: string;
  remark: string;
}

export interface ISailorCertType {
  id: number;
  name: string;
  remark: string;
}

export interface ISailorCert {
  id: string;
  name: string;
  identityNumber: string;
  expiredAt: string;
  issuedAt: string;
  remark: string;
  sailorId: number;

  sailorCertTypeId: number;
  sailorCertTypeName: string;
  issueDepartmentTypeId: number;
  issueDepartmentTypeName: string;
  ossFiles: IOSSMetaFile[];
  isRemoved: boolean;
}
