import request from '@/utils/request';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';

export async function getIssueDepartmentType(): Promise<IssueDepartmentType[]> {
  return await request(`/api/common-option-types/IssueDepartmentType`, {
    method: 'GET',
  });
}
