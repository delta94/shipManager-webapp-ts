import request from "@/utils/request";
import {stringify} from "qs";
import IShip from "@/interfaces/IShip";

export async function getShip(id: number): Promise<IShip> {
  return request( `/api/ships/${id}`, {
    method: 'GET'
  });
}

export async function listShip(params:any): Promise<IShip[]> {
  if (params && params.page) {
    params.page = params.page - 1
  }

  return request( `/api/ships-list?${stringify(params)}`, {
    method: 'GET'
  });
}

export async function listShipMeta() {
  return request( '/api/ships-meta-list', {
    method: 'GET'
  });
}

export async function addShip(params: any) {
  return request('/api/ships', {
    method: 'POST',
    body: params
  });
}

export async function infoShip(id: number): Promise<IShip> {
  return request( `/api/ships/${id}`, {
    method: 'GET'
  });
}

export async function deleteShip(id: number) {
  return request(`/api/ships/${id}`, {
    method: 'DELETE'
  });
}

export async function updateShip(params: any) {
  return request(`/api/ships/${params.id}`, {
    method: 'UPDATE',
    body: params
  });
}

export async function listShipTypes() {
  return request( `/api/ship-types`, {
    method: 'GET'
  });
}

export async function listShipMaterial() {
  return request( `/api/ship-materials`, {
    method: 'GET'
  });
}
