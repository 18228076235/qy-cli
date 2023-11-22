import LoginStore, { ILoginStore } from './Login';
import ModelLibraryStore, { IModelLibrary } from './ModelLibrary';
import AccountStore, { IAccountStore } from './Account';
import ModelComparedStore, { IModelComparedStore } from './ModelCompared';

export default {
  LoginStore,
  AccountStore,
  ModelLibraryStore,
  ModelComparedStore
};

export interface IStore {
  LoginStore: ILoginStore;
  AccountStore: IAccountStore;
  ModelLibraryStore: IModelLibrary;
  ModelComparedStore: IModelComparedStore;
}
