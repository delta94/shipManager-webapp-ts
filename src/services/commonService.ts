import request from '@/utils/request';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';

export async function getIssueDepartmentType(): Promise<IssueDepartmentType[]> {
  return await request(`/api/issue-department-types`, {
    method: 'GET',
  });
}
