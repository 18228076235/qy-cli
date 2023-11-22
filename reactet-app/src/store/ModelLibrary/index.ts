/*
 * @Author: huxianyong
 * @Date: 2019-11-21 20:41:52
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-02 16:16:50
 */

import ListStore, { IListStore } from './Components/ListStore';
import EditStore, { IEditStore } from './Components/EditStore';
import DrawerStore, { IDrawerStore } from './Components/DrawerStore';
class ModelLibraryStore {
  public DrawerStore: IDrawerStore;
  public ListStore: IListStore;
  public EditStore: IEditStore;
  constructor() {
    this.ListStore = new ListStore(this);
    this.DrawerStore = new DrawerStore(this);
    this.EditStore = new EditStore(this);
  }
}
export default new ModelLibraryStore();
export interface IModelLibrary extends ModelLibraryStore {}
