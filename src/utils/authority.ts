// use localStorage to store the authority info, which might be sent from server in actual project.
import { parse } from 'qs';
import IAccount from '@/interfaces/IAccount';

export function getAuthority(str?: string): string | string[] {
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('ship-manager-authority') : str;

  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('ship-manager-authority', JSON.stringify(proAuthority));
}

export function updateToken(token: string) {
  if (token === '') {
    localStorage.removeItem('ship-manager-token');
  } else {
    localStorage.setItem('ship-manager-token', token);
  }
}

export function getToken() {
  return localStorage.getItem('ship-manager-token');
}

export function updateUser(user: IAccount | undefined) {
  if (!user) {
    localStorage.removeItem('ship-manager-user');
  } else {
    localStorage.setItem('ship-manager-user', JSON.stringify(user));
  }
}

export function getUser(): IAccount | undefined {
  if (localStorage.getItem('ship-manager-user')) {
    let userStr = localStorage.getItem('ship-manager-user');
    try {
      if (userStr) {
        let user = JSON.parse(userStr);
        return user;
      }
      return undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
  return undefined;
}
