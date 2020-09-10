import { SyncHook } from '@funnyecho/hamon';
import { ICompanyCert } from '@/interfaces/ICompany';

const hooks = {
  DeleteCompanyCert: new SyncHook<[ICompanyCert]>(),
  EditCompanyCert: new SyncHook<[ICompanyCert]>(),
  InfoCompanyCert: new SyncHook<[ICompanyCert]>(),
};

export default hooks;
