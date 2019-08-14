import request from '@/utils/request';
import { IStsToken } from '@/interfaces/IStsToken';

export async function getStsToken(): Promise<IStsToken> {
  return request('/api/aliyun/oss/token', {
    method: 'GET',
  });
}
