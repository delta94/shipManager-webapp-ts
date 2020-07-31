import { SyncHook } from '@funnyecho/hamon';
import { IShipLicense, IShipMachine, IShipPayload } from '@/interfaces/IShip';
import { ISailor } from '@/interfaces/ISailor';

const hooks = {
  DeleteShipLicense: new SyncHook<[IShipLicense]>(),
  EditShipLicense: new SyncHook<[IShipLicense]>(),
  InfoShipLicense: new SyncHook<[IShipLicense]>(),

  DeleteShipPayload: new SyncHook<[IShipPayload]>(),

  InfoSailor: new SyncHook<[ISailor]>(),
  DeleteSailor: new SyncHook<[ISailor]>(),

  InfoShipMachine: new SyncHook<[IShipMachine]>(),
  EditShipMachine: new SyncHook<[IShipMachine]>(),
  DeleteShipMachine: new SyncHook<[IShipMachine]>(),
};

export default hooks;
