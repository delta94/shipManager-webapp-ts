import { ICompanySheet, ICompanySheetType } from '@/interfaces/ICompanySheet';
import request from '@/utils/request';
import { stringify } from 'qs';

export async function infoCompanySheet(id: number): Promise<ICompanySheet> {
  return request(`/api/company-sheets/${id}`, {
    method: 'GET',
  });
}

export async function deleteCompanySheet(id: number): Promise<void> {
  return request(`/api/company-sheets/${id}`, {
    method: 'DELETE',
  });
}

export async function createCompanySheet(params: any): Promise<void> {
  return request("/api/company-sheets/", {
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

export async function listCompanyCommonSheets(params: any) {
  if (params && params.page) {
    params.page -= 1;
  }

  return request(`/api/company-sheets-list?isTemplate.in=false&${stringify(params)}`, {
    method: 'GET',
  });
}

export async function listCompanyTemplateSheets(params: any) {
  if (params && params.page) {
    params.page -= 1;
  }

  return request(`/api/company-sheets-list?isTemplate.in=true&${stringify(params)}`, {
    method: 'GET',
  });
}
