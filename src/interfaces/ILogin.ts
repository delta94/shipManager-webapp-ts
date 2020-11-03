import IAccount from "@/interfaces/IAccount";

export interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}


export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}


export interface LoginResult {
  id_token: string
  user: IAccount
}
