/*
 * @Author: huxianyong
 * @Date: 2019-11-21 20:57:12
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:56:29
 */
import { IModelLibrary } from '../../index';
import { BaseStore } from '../../../BaseStore';
import { observable, action, lockAsync, runInAction } from '../../../utils';
import modelLibraryServer from 'server/ModelLibrary';
import { EType } from '../../interface';
class ListStore extends BaseStore {
  private rootStore: IModelLibrary;
  @observable drawerVisible: boolean = false;
  @observable dataSource: any[] = [];
  @observable index: number = 1;
  @observable size: number = 15;
  @observable total: number = 0;
  @observable nameOrPhone: string = '';
  constructor(rootStore: IModelLibrary) {
    super();
    this.rootStore = rootStore;
    this.setInitialState();
  }
  @action.bound
  changeDrawerVisible() {
    this.drawerVisible = !this.drawerVisible;
  }
  @action.bound
  @lockAsync
  async customerManage() {
    try {
      const { data } = await modelLibraryServer.customerManage({
        index: this.index,
        size: this.size,
        nameOrPhone: this.nameOrPhone
      });
      runInAction(() => {
        this.dataSource = data.records;
        this.total = data.total;
      });
    } catch (error) {
    } finally {
    }
  }
  /**
   *
   * @param customerId
   * @param customerName
   * @param customerPhone
   * @param type 1 3d模型 2 以对比模型
   */
  @action.bound
  openDrawer(
    customerId: string,
    customerName: string,
    customerPhone: number,
    type: EType
  ) {
    this.drawerVisible = true;
    this.rootStore.DrawerStore.setDrawerParam(
      customerId,
      customerName,
      customerPhone,
      type
    );
  }
  @action.bound
  changeUserInfo(nameOrPhone: string) {
    if (nameOrPhone === this.nameOrPhone) {
      return;
    }
    this.nameOrPhone = nameOrPhone.trim();
    this.index = 1;
    this.customerManage();
  }
  @action.bound
  changePageInfo(index: number, size: number) {
    this.index = index;
    this.size = size;
    this.customerManage();
  }
  @action.bound
  changePages(index: number, size: number) {
    this.index = index;
    this.size = size;
    this.customerManage();
  }
}
export default ListStore;
export interface IListStore extends ListStore {}
