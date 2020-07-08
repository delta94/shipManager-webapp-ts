import request from '@/utils/request';
import { IManagerCertType } from '@/interfaces/IManager';

export async function listManagerCertType(): Promise<IManagerCertType[]> {
  return request('/api/manager-cert-types', {
    method: 'GET',
  });
}
