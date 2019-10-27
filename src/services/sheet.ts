import { ICompanySheet, ICompanySheetType } from '@/interfaces/ICompanySheet';
import request from '@/utils/request';
import { stringify } from 'qs';
import { ICompanyCertType } from '@/interfaces/ICompany';

export async function infoCompanySheet(id: number): Promise<ICompanySheet> {
  return request(`/api/company-sheets/${id}`, {
    method: 'GET',
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
