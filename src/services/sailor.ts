import request from '@/utils/request';
import ISailor, {ISailorPosition} from '@/interfaces/ISailor';
import { PageableData } from '@/interfaces/ITableList';
import {ICompanyLicense} from "@/interfaces/ICompany";
import {parseUploadData} from "@/utils/OSSClient";

export async function listSailorPosition(): Promise<ISailorPosition[]> {
  return request('/api/sailor-positions', {
    method: 'GET',
  });
}

export async function addSailor(params: any): Promise<ISailor> {
  return request('/api/sailors', {
    method: 'POST',
    data: params,
  });
}

export async function updateSailor(params: any): Promise<ISailor> {
  return request('/api/sailors', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteSailor(id: number): Promise<void> {
  return request(`/api/sailors/${id}`, {
    method: 'DELETE',
  });
}

export async function infoSailor(id: number): Promise<ISailor> {
  return request(`/api/sailors/${id}`, {
    method: 'GET',
  }).then((data: ISailor) => {
    data.ex_certFile = parseUploadData(data.certFile);
    return data;
  });
}

export async function listSailor(
  page: number = 0,
  size: number = 20,
  extra: object,
): Promise<PageableData<ISailor>> {
  return await request('/api/sailors/list', {
    method: 'GET',
    params: {
      page: page - 1,
      size,
      ...extra,
    },
  });
}
