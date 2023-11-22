import { action, observable, lockAsync } from '../../../utils';
import { BaseStore } from '../../../BaseStore';
import { IModelLibrary } from '../../index';
import moment, { Moment } from 'moment';
import Api from 'server/ModelLibrary';
import { message } from 'antd';
import { useStore } from 'store/utils';

class EditStore extends BaseStore {
  private rootStore: IModelLibrary;
  constructor(rootStore: IModelLibrary) {
    super();
    this.rootStore = rootStore;
  }
  @observable visible: boolean = false;
  @observable formData: any = {
    modelId: '',
    projectId: [],
    modelState: 1,
    updateDate: moment()
  };
  @action.bound
  setFormData(data: IEditParams) {
    this.formData = data;
  }
  @action.bound
  setVisible(value: boolean) {
    this.visible = value;
  }
  @action.bound
  @lockAsync
  async postThreeDInfo(params: IEditParams) {
    const res = await Api.editThreeDInfo(params);
    message.success('修改成功');
    return Promise.resolve();
  }
}
export default EditStore;
export interface IEditStore extends EditStore {}
export interface IEditParams {
  modelId: string;
  projectId: string[];
  state: number;
  uploadDate: Moment;
}
