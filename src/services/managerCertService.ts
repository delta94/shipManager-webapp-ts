import request from '@/utils/request';
import { IManagerCertType } from '@/interfaces/IManager';

export async function getManagerCertType(): Promise<IManagerCertType[]> {
  return request('/api/common-option-types/ManagerCertType', {
    method: 'GET',
  });
}

export const ManagerCertKeyMap = {
  name: '名称',
  identityNumber: '证书编号',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  managerCertTypeName: '证书类型',
  issueDepartmentTypeName: '颁发机构',
  ossFiles: '证书电子件',
};
