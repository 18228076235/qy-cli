/*
 * @Author: huxianyong
 * @Date: 2019-11-21 21:07:33
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:38:54
 */
import { IModelLibrary } from '../../index';
import { BaseStore } from '../../../BaseStore';
import { observable, action, lockAsync, runInAction } from '../../../utils';
import { IPhotoDatas, EType } from '../../interface';
import modelLibraryServer from 'server/ModelLibrary';
import moment, { Moment } from 'moment';
import { message } from 'antd';
const searchCValue = {
  customId: '',
  type: 0
};
class DrawerStore extends BaseStore {
  private rootStore: IModelLibrary;
  constructor(rootStore: IModelLibrary) {
    super();
    this.rootStore = rootStore;
    this.setInitialState();
  }
  @observable photoDatas: any[] = [];
  @observable contrastPhoto: any[] = [];
  @observable customerName: string = '';
  @observable customerPhone: number | undefined = undefined;
  @observable queryValue = searchCValue;
  @observable customId: string = '';
  @observable type: EType = EType.THREEMODAL;
  @observable projectId: string[] = [];
  @observable startTime: string | undefined = '';
  @observable endTime: string | undefined = '';
  @observable state: any = [];
  @observable projectOption: any = [];
  @observable editor: string = '';
  @observable title: string = '';
  @observable modelId: string = '';
  @observable editorList: any[] = [];

  /*获取项目Id*/
  @action.bound
  onProjectChange = (value: string[]) => {
    this.projectId = value;
    this.getDrawerInfo();
  };
  /*获取时间*/
  @action.bound
  onDateChange = (e: any) => {
    this.startTime = e[0]
      ? moment(e[0]).format('YYYY-MM-DD 00:00:00')
      : undefined;

    this.endTime = e[1]
      ? moment(e[1]).format('YYYY-MM-DD 23:59:59')
      : undefined;
    this.getDrawerInfo();
  };
  /*获取照片类型*/

  @action.bound
  chooseState = (value: []) => {
    this.state = value;
    this.getDrawerInfo();
  };
  /*获取type*/

  @action.bound
  typeChange(type: EType) {
    this.type = type;
    if (type === EType.THREEMODAL) {
      this.getDrawerInfo();
    }
    if (type === EType.COMPAREDMODAL) {
      this.getCompareInfo();
    }
  }
  /*获取输入的对比标题*/

  @action.bound
  getTitle = (e: any) => {
    if (e.target.value === this.title) {
      return;
    }
    this.title = e.target.value.trim();
    this.getCompareInfo();
  };

  /*获取用户列表参数*/
  @action.bound
  setDrawerParam(
    customId: string,
    customerName: string,
    customerPhone: number,
    type: EType
  ) {
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.customId = customId;
    this.type = type;

    this.getProjectOption();

    this.editorOption();
    if (type === EType.THREEMODAL) {
      this.getDrawerInfo();
    }
    if (type === EType.COMPAREDMODAL) {
      this.getCompareInfo();
    }
  }

  @action.bound
  setContrastModel(model: any) {
    this.contrastPhoto = model;
  }
  /*获取客户模拟信息*/

  @action.bound
  @lockAsync
  async getDrawerInfo() {
    try {
      let query = { customId: this.customId };
      if (this.type === EType.THREEMODAL) {
        query = Object.assign(query, {
          projectId: this.projectId ? this.projectId : undefined,
          startTime: this.startTime,
          endTime: this.endTime,
          state: this.state
        });
      } else {
        query = Object.assign(query, {});
      }
      const { data } = await modelLibraryServer.getCustomDetailInfo(query);
      runInAction(() => {
        if (this.type === EType.THREEMODAL) {
          this.photoDatas = data;
        } else {
          this.setContrastModel(data);
        }
      });
    } catch (error) {}
  }

  /*根据客户id获取项目信息*/

  @action.bound
  @lockAsync
  async getProjectOption() {
    try {
      const { data } = await modelLibraryServer.getCustomProjectInfo(
        this.customId
      );
      runInAction(() => {
        this.projectOption = data;
      });
    } catch (error) {}
  }
  /*获取已对比模拟信息*/

  @action.bound
  @lockAsync
  async getCompareInfo() {
    try {
      let query = { customId: this.customId };
      query = Object.assign(query, {
        title: this.title,
        editor: this.editor
      });
      const { data } = await modelLibraryServer.getCustomCompareInfo(query);
      runInAction(() => {
        this.contrastPhoto = data;
      });
    } catch (error) {}
  }

  /*获取编辑人信息*/

  @action.bound
  @lockAsync
  async editorOption() {
    try {
      const { data } = await modelLibraryServer.getEditorInfo(this.customId);
      runInAction(() => {
        this.editorList = data;
      });
    } catch (error) {}
  }
  /*删除模型信息*/

  @action.bound
  @lockAsync
  async deleteThreeModel(modelId: string) {
    try {
      const { data } = await modelLibraryServer.deleteThreeModel({ modelId });
      message.success('删除成功');
      this.getDrawerInfo();
    } catch (error) {}
  }
  /*选择编辑人*/

  @action.bound
  chooseEditor = (value: string) => {
    this.editor = value;
    this.getCompareInfo();
  };

  @action.bound
  @lockAsync
  async deleteCompareModel(compareModelId: string) {
    try {
      const res = await modelLibraryServer.deleteCompareModel({
        compareModelId
      });
      this.getCompareInfo();
      message.success('删除成功');
    } finally {
    }
  }
}
export default DrawerStore;
export interface IDrawerStore extends DrawerStore {}
