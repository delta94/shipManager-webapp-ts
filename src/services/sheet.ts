import { ICompanySheet, ICompanySheetType } from '@/interfaces/ICompanySheet';
import request from '@/utils/request';
import { PageableData } from '@/interfaces/ITableList';
import { parseUploadData } from '@/utils/OSSClient';

export async function infoCompanySheet(id: number): Promise<ICompanySheet> {
  return request(`/api/company-sheets/${id}`, {
    method: 'GET',
  }).then((data: ICompanySheet) => {
    data.ex_ossFile = parseUploadData(data.ossFile);
    return data;
  });
}

export async function deleteCompanySheet(id: number): Promise<void> {
  return request(`/api/company-sheets/${id}`, {
    method: 'DELETE',
  });
}

export async function addCompanySheet(params: Partial<ICompanySheet>): Promise<void> {
  return request('/api/company-sheets/', {
    method: 'POST',
    data: params,
  });
}

export async function updateCompanySheet(params: any): Promise<void> {
  return request(`/api/company-sheets/`, {
    method: 'PUT',
    data: params,
  });
}

export async function listCompanySheetTypes(): Promise<ICompanySheetType[]> {
  return request('/api/company-sheet-types', {
    method: 'GET',
  });
}

export async function listCompanyCommonSheets(
  page: number = 0,
  size: number = 20,
  extra: object,
): Promise<PageableData<ICompanySheet>> {
  return await request('/api/company-sheets-list', {
    method: 'GET',
    params: {
      'isTemplate.in': false,
      page: page - 1,
      size,
      ...extra,
    },
  });
}

export async function listCompanyTemplateSheets(
  page: number = 0,
  size: number = 20,
  extra: object,
): Promise<PageableData<ICompanySheet>> {
  return await request('/api/company-sheets-list', {
    method: 'GET',
    params: {
      'isTemplate.in': true,
      page: page - 1,
      size,
      ...extra,
    },
  });
}
