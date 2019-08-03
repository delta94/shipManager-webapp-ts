import request from "@/utils/request";
import ISailor from "@/interfaces/ISailor";

import {stringify} from "qs";

export async function listSailorPosition() {
  return request( `/api/sailor-positions`, {
    method: 'GET'
  });
}

export async function addSailor(params: any): Promise<ISailor> {
  return request('/api/sailors', {
    method: 'POST',
    body: params
  });
}

export async function updateSailor(params: any): Promise<ISailor> {
  return request('/api/sailors', {
    method: 'PUT',
    body: params
  });
}

export async function deleteSailor(id: number): Promise<void> {
  return request(`/api/sailors/${id}`, {
    method: 'DELETE'
  });
}

export async function infoSailor(id: number): Promise<ISailor> {
  return request(`/api/sailors/${id}`, {
    method: 'GET'
  });
}

export async function listSailor(params: any): Promise<ISailor[]> {
  if (params && params.page) {
    params.page = params.page - 1
  }

  return request( `/api/sailors-list?${stringify(params)}`, {
    method: 'GET'
  });
}