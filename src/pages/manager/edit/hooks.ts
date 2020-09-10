import { SyncHook } from '@funnyecho/hamon';
import { IManagerCert } from '@/interfaces/IManager';

const hooks = {
  DeleteManagerCert: new SyncHook<[IManagerCert]>(),
  EditManagerCert: new SyncHook<[IManagerCert]>(),
  InfoManagerCert: new SyncHook<[IManagerCert]>(),
};

export default hooks;
