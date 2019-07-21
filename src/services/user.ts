import request from '@/utils/request';
import {LoginForm, LoginResult} from "@/interfaces/ILogin";
import IAccount from "@/interfaces/IAccount";

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function accountLogin(params: LoginForm): Promise<LoginResult> {
  return request('/api/authenticate', {
    method: 'POST',
    data: params
  });
}

export async function getCurrentUser(): Promise<IAccount>{
  return request('/api/account', {
    method: 'GET'
  });
}
