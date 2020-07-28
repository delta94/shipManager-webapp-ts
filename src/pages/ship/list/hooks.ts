import { SyncHook } from '@funnyecho/hamon';
import { IShip } from '@/interfaces/IShip';

const hooks = {
  DeleteShip: new SyncHook<[IShip]>(),
  EditShip: new SyncHook<[IShip]>(),
  InfoShip: new SyncHook<[IShip]>(),
};

export default hooks;
