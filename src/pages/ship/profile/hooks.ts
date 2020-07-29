import { SyncHook } from '@funnyecho/hamon';
import { IShipLicense } from '@/interfaces/IShip';

const hooks = {
  DeleteShipLicenseCert: new SyncHook<[IShipLicense]>(),
  EditShipLicenseCert: new SyncHook<[IShipLicense]>(),
  InfoShipLicenseCert: new SyncHook<[IShipLicense]>(),
};

export default hooks;
