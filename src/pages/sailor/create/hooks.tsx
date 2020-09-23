import { SyncHook } from '@funnyecho/hamon';
import { ISailorCert } from '@/interfaces/ISailor';

const hooks = {
  DeleteSailorCert: new SyncHook<[ISailorCert]>(),
  EditSailorCert: new SyncHook<[ISailorCert]>(),
  InfoSailorCert: new SyncHook<[ISailorCert]>(),
};

export default hooks;
