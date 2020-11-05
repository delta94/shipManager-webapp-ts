import request from '@/utils/request';
import { IStsToken } from '@/interfaces/IStsToken';
import {ICategory, ICommonOptionType} from "@/interfaces/ICategory";

export async function getStsToken(): Promise<IStsToken> {
  return request('/api/aliyun/oss/token', {
    method: 'GET',
  });
}

export async function listOptions(categories: ICategory[]): Promise<Record<ICategory, ICommonOptionType[]>> {
  return request(`/api/common-option-types`, {
    method: 'GET',
    params: {
      category: categories
    }
  });
}
