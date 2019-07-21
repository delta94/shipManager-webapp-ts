
export default interface IAccount {
  id: number
  login: string
  firstName: string
  lastName: string
  email: string

  imageUrl:string
  activated: boolean

  langKey: string
  createdBy: string
  createdDate: Date
  lastModifiedBy: string

  lastModifiedDate: Date
  authorities: IAccountRole[]
}


export enum IAccountRole {
  ROLE_ANONYMOUS = "ROLE_ANONYMOUS",
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN"
}
