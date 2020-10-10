import { SyncHook } from '@funnyecho/hamon';
import { IDocument } from '@/interfaces/IDocument';

const hooks = {
  DeleteDocument: new SyncHook<[IDocument]>(),
  EditDocument: new SyncHook<[IDocument]>(),
  InfoDocument: new SyncHook<[IDocument]>(),
};

export default hooks;
