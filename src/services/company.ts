import { stringify } from 'qs';
import request from '@/utils/request';
import { ICompanyCert, ICompanyCertType, ICompanyLicense } from '@/interfaces/ICompany';
import { PageableData } from '@/interfaces/ITableList';

export async function listCompanyCertType(): Promise<ICompanyCertType[]> {
  return request('/api/company-cert-types', {
    method: 'GET',
  });
}

export async function addCompanyCert(params: Partial<ICompanyCert>): Promise<ICompanyCert> {
  return request('/api/company-certs', {
    method: 'POST',
    data: params,
  });
}

export async function updateCompanyCert(params: Partial<ICompanyCert>): Promise<ICompanyCert> {
  return request('/api/company-certs', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteCompanyCert(id: number) {
  return request(`/api/company-certs/${id}`, {
    method: 'DELETE',
  });
}

export async function infoCompanyCert(id: number) {
  return request(`/api/company-certs/${id}`, {
    method: 'GET',
  });
}

export async function listCompanyCert(
  page: number = 0,
  size: number = 20,
  sort: string = '',
): Promise<PageableData<ICompanyCert>> {
  return await request('/api/company-certs-list', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      sort,
    },
  });
}

/* Company License */

export async function addCompanyLicense(
  params: Partial<ICompanyLicense>,
): Promise<ICompanyLicense> {
  return request('/api/company-licenses', {
    method: 'POST',
    data: params,
  });
}

export async function updateCompanyLicense(
  params: Partial<ICompanyLicense>,
): Promise<ICompanyLicense> {
  return request('/api/company-licenses', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteCompanyLicense(id: number) {
  return request(`/api/company-licenses/${id}`, {
    method: 'DELETE',
  });
}

export async function infoCompanyLicense(id: number) {
  return request(`/api/company-licenses/${id}`, {
    method: 'GET',
  });
}

export async function listCompanyLicense(params: any) {
  if (params && params.page) {
    params.page -= 1;
  }
  return request(`/api/company-licenses-list?${stringify(params)}`, {
    method: 'GET',
  });
}
