import { SyncHook } from '@funnyecho/hamon';
import { ISailor } from '@/interfaces/ISailor';

const hooks = {
  DeleteSailor: new SyncHook<[ISailor]>(),
  EditSailor: new SyncHook<[ISailor]>(),
  InfoSailor: new SyncHook<[ISailor]>(),
};

export default hooks;
