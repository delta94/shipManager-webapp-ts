import request from '@/utils/request';
import { LoginForm, LoginResult } from '@/interfaces/ILogin';
import IAccount from '@/interfaces/IAccount';

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function accountLogin(params: LoginForm): Promise<LoginResult> {
  return request('/api/authenticate', {
    method: 'POST',
    data: params,
  });
}

export async function getCurrentUser(): Promise<IAccount> {
  return request('/api/account', {
    method: 'GET',
  });
}

export async function updateCurrentUser(params: Partial<IAccount>): Promise<IAccount> {
  return request('/api/account', {
    method: 'POST',
    data: params,
  });
}

export async function updateCurrentPassword(params: any): Promise<void> {
  return request('/api/account/change-password', {
    method: 'POST',
    data: params,
  });
}

export const UserKeyMap = {
  login: '登录名',
  firstName: '姓名',
  email: '邮箱地址',
  address: '地址',
  profile: '个人介绍',
  mobile: '手机'
};

