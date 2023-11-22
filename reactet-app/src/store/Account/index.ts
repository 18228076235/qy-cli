/*
 * @Author: shiyao you
 * @Date: 2019-11-26 17:28:36
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-02 16:13:44
 */
import { AccountServer } from 'server';
import { observable, action, lockAsync, computed } from '../utils';
import { message } from 'antd';

enum EERRORCODE {
  DISABLE_ACCOUNT = 20007,
  USER_NOT_FOUND = 20008,
  USER_PASSWORD_ERRO = 20009,
  MOBILE_ERROR = 20010
}
class Account {
  @observable data: any = [];
  @observable index: number = 1;
  @observable size: number = 15;
  @observable search: string;
  @observable total: number;
  @observable loading: boolean;

  @computed get datas() {
    return this.data;
  }
  @action.bound
  setTableData(data: any) {
    if (data) {
      data.forEach((item: any) => {
        // 格式化日期
        const date = new Date(item.createDate);
        item.myCreateDate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()}`;

        item.mySex = item.sex === 1 ? '男' : '女';
      });
    }
    this.data = data;
  }
  @action.bound
  setPage(index: number, size: number) {
    this.index = index;
    this.size = size;
  }

  @action.bound
  setTotal(total: number) {
    this.total = total;
  }

  @action.bound
  setLoading(flag: boolean) {
    this.loading = flag;
  }

  @action.bound
  setInfo(search: string) {
    this.search = search;
  }
  /**
   * 获取用户列表
   * @param index 页码
   * @param size 每页显示条数
   */
  @action.bound
  @lockAsync
  async getAllUsers(index: number, size: number, info: string = '') {
    this.setLoading(true);
    try {
      let { data } = await AccountServer.getAll({
        index,
        size,
        info
      });
      this.setTableData(data.records);
      this.setPage(parseInt(data.current), parseInt(data.size));
      this.setTotal(parseInt(data.total));
      // console.log(data);
    } finally {
      // console.log(this.data);
      this.setLoading(false);
    }
  }
  /**
   * 通过姓名工号获取用户列表
   * @param info
   */
  @action.bound
  @lockAsync
  async getUserListBy(info: string) {
    this.setLoading(true);
    try {
      const { data } = await AccountServer.getUserListBy({
        info
      });
      this.setTableData(data);
      this.setPage(1, this.size);
      data ? this.setTotal(data.length) : this.setTotal(0);
    } finally {
      this.setLoading(false);
    }
  }
  /**
   * 新增账号
   * @param params 账号参数
   */
  @action.bound
  @lockAsync
  async saveUser(params: object) {
    this.setLoading(true);
    try {
      await AccountServer.saveUser(params);
      await this.getAllUsers(this.index, this.size, this.search);
      message.success('新增成功');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * 删除用户
   * @param userId 用户ID
   */
  @action.bound
  @lockAsync
  async deleteUser(userId: string) {
    this.setLoading(true);
    // console.log(userId)
    try {
      await AccountServer.deleteUser({ userId });
      await this.getAllUsers(this.index, this.size, this.search);
      message.success('删除成功');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   *修改用户
   * @param {object} 用户修改内容
   * @memberof Account
   */
  @action.bound
  @lockAsync
  async editUser(params: object) {
    try {
      await AccountServer.editUser(params);
      await this.getAllUsers(this.index, this.size, this.search);
      message.success('修改成功');
    } finally {
    }
  }

  @action.bound
  @lockAsync
  async editPwd(params: object) {
    try {
      await AccountServer.editPwd(params);
      message.success('修改成功');
      await this.getAllUsers(this.index, this.size, this.search);
    } finally {
    }
  }
}
export default new Account();
export interface IAccountStore extends Account {}
