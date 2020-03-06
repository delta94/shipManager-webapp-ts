import request from '@/utils/request';
import { ICompanyCert, ICompanyCertType, ICompanyLicense } from '@/interfaces/ICompany';
import { PageableData } from '@/interfaces/ITableList';
import { parseUploadData } from '@/utils/OSSClient';

export async function listCompanyCertType(): Promise<ICompanyCertType[]> {
  return request('/api/company-cert-types', {
    method: 'GET',
  });
}

export async function addCompanyCert(cert: Partial<ICompanyCert>): Promise<ICompanyCert> {
  return request('/api/company-certs', {
    method: 'POST',
    data: cert,
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

export async function infoCompanyCert(id: number): Promise<ICompanyCert> {
  return request(`/api/company-certs/${id}`, {
    method: 'GET',
  }).then((data: ICompanyCert) => {
    data.ex_ossFile = parseUploadData(data.ossFile);
    return data;
  });
}

export async function listCompanyCert(
  page: number = 0,
  size: number = 20,
  extra: object,
): Promise<PageableData<ICompanyCert>> {
  return await request('/api/company-certs-list', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
  });
}

/* Company License */

export async function addCompanyLicense(
  license: Partial<ICompanyLicense>,
): Promise<ICompanyLicense> {
  return request('/api/company-licenses', {
    method: 'POST',
    data: license,
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

export async function infoCompanyLicense(id: number): Promise<ICompanyLicense> {
  return request(`/api/company-licenses/${id}`, {
    method: 'GET',
  }).then((data: ICompanyLicense) => {
    data.ex_ossFile = parseUploadData(data.ossFile);
    return data;
  });
}

export async function listCompanyLicense(
  page: number = 0,
  size: number = 20,
  extra: object,
): Promise<PageableData<ICompanyLicense>> {
  return await request('/api/company-licenses-list', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
  });
}
