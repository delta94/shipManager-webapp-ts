import { SyncHook } from '@funnyecho/hamon';
import { IManager } from '@/interfaces/IManager';

const hooks = {
  DeleteManager: new SyncHook<[IManager]>(),
  EditManager: new SyncHook<[IManager]>(),
  InfoManager: new SyncHook<[IManager]>(),
};

export default hooks;
