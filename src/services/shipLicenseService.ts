import { IShipLicense } from '@/interfaces/IShip';
import request from '@/utils/request';

export async function infoShipLicense(id: number): Promise<IShipLicense> {
  return await request(`/api/ship-licenses/${id}`, {
    method: 'GET',
  });
}

export async function createShipLicense(license: IShipLicense): Promise<IShipLicense> {
  return await request(`/api/ship-licenses/`, {
    method: 'POST',
    data: license,
  });
}

export async function updateShipLicense(license: IShipLicense): Promise<IShipLicense> {
  return await request(`/api/ship-licenses/`, {
    method: 'PUT',
    data: license,
  });
}

export async function deleteShipLicense(id: string): Promise<IShipLicense> {
  return await request(`/api/ship-licenses/${id}`, {
    method: 'DELETE',
  });
}

export const ShipLicenseKeyMap = {
  name: '名称',
  identityNumber: '营运证编号',
  issueDepartmentType: '颁发机构',
  shipLicenseType: '营运证类型',
  businessField: '经营范围',
  expiredAt: '过期日期',
  issuedAt: '颁发日期',
  remark: '备注',
  ossFiles: '证书电子件'
};
