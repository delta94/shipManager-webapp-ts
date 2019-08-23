import { stringify } from 'qs';
import request from '@/utils/request';
import { ICompanyCert, ICompanyCertType, ICompanyLicense } from '@/interfaces/ICompany'

export async function listCompanyCertType(): Promise<ICompanyCertType[]> {
  return request('/api/company-cert-types', {
    method: 'GET',
  });
}

export async function addCompanyCert(params: Partial<ICompanyCert>): Promise<ICompanyCert> {
  return request('/api/company-certs', {
    method: 'POST',
    data: params,
  })
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

export async function listCompanyCert(params: any) {
  if (params && params.page) {
    params.page -= 1;
  }
  return request(`/api/company-certs-list?${stringify(params)}`, {
    method: 'GET',
  });
}

/* Company License*/

export async function addCompanyLicense(params: Partial<ICompanyLicense>): Promise<ICompanyLicense> {
  return request('/api/company-licenses', {
    method: 'POST',
    data: params,
  })
}

export async function updateCompanyLicense(params: Partial<ICompanyLicense>): Promise<ICompanyLicense> {
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
  return request(`/api/company-licenses?${stringify(params)}`, {
    method: 'GET',
  });
}


