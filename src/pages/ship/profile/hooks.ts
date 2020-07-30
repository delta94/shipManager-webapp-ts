import { SyncHook } from '@funnyecho/hamon';
import {IShipLicense, IShipPayload} from '@/interfaces/IShip';

const hooks = {
  DeleteShipLicense: new SyncHook<[IShipLicense]>(),
  EditShipLicense: new SyncHook<[IShipLicense]>(),
  InfoShipLicense: new SyncHook<[IShipLicense]>(),

  DeleteShipPayload: new SyncHook<[IShipPayload]>(),
};

export default hooks;
