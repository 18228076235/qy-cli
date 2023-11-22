/*
 * @Author: huxianyong
 * @Date: 2019-11-28 19:08:03
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-12-05 20:49:06
 */
import {
  observable,
  action,
  lockAsync,
  runInAction,
  observer,
  computed
} from '../utils';
import { BaseStore } from '../BaseStore';
import Api from 'server/ModelLibrary';
import { message } from 'antd';
import {
  IOption,
  IPhotoDatas,
  IChildren,
  IComparedDatas,
  IModels
} from './interface';
import moment, { Moment } from 'moment';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { cloneDeep } from 'lodash-es';
import ModelComparedServer from 'server/ModelCompared';
import { IMODApiData } from 'server/Login';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
const editInfos = {
  modifyDate: '',
  title: '',
  keyUid: ''
};
type TEditinfo = typeof editInfos;
class ModelComparedStore extends BaseStore {
  @observable drawerVisible: boolean = false;
  @observable customId: string = '';
  @observable compareModelId: string = '';
  @observable tabActive: string = 'normal';
  @observable activeProject = new Set();
  @observable photoType: number = 1; // 1 术前 2术后 3 模拟
  @observable projectOption: IOption[] = [];
  @observable threeDPhotoDatas: IPhotoDatas[] = [];
  @observable date: RangePickerValue = [];
  @observable comparedDatas: IComparedDatas[] = []; // 对比数据
  @observable photoDragData: any = null;
  @observable comparedDragData: IComparedDatas[] | null = null;
  @observable compareListPhoto: any = []; // 抽屉对比模型照片
  @observable saveModalVisible: boolean = false;
  @observable editor: undefined | string = undefined; // 以对比模型搜索编辑人
  @observable title: undefined | string = undefined; // 以对比模型搜索对比模型标题
  @observable confirmLoading: boolean = false;
  @observable editorOption: object[] = [];
  @observable editInfo: TEditinfo = editInfos;
  @observable showFeaturePoints: boolean = false;
  @observable numberLimit: string = '';
  constructor() {
    super();
    this.setInitialState();
  }
  @action.bound
  setId(id: string) {
    this.customId = id;
  }
  @action.bound
  changeVisible() {
    if (this.saveModalVisible) {
      this.numberLimit = '';
    }
    this.saveModalVisible = !this.saveModalVisible;
  }
  // 模型对比照片抽屉
  @action.bound
  changeDrawerVisible() {
    this.drawerVisible = !this.drawerVisible;
    if (this.drawerVisible) {
      this.getProjectData();
      this.get3DMdelInfo();
    }
  }
  // 模型对比照片抽屉tabs 切换
  @action.bound
  changeTabs(key: string) {
    this.tabActive = key;
    if (key === 'compare') {
      this.getComparedModel();
    } else {
      this.get3DMdelInfo();
    }
  }
  // 模型对比照片抽屉照片点击
  @action.bound
  photoClick() {}
  @action.bound
  changeProject(value: string) {
    this.activeProject.has(value)
      ? this.activeProject.delete(value)
      : this.activeProject.add(value);
    this.get3DMdelInfo();
  }
  @action.bound
  changeType(value: number) {
    this.photoType = value;
    this.get3DMdelInfo();
  }
  //获取3d 模型照片
  @action.bound
  @lockAsync
  async get3DMdelInfo() {
    try {
      const queryData = {
        customId: this.customId,
        projectId: Array.from(this.activeProject),
        state: [this.photoType],
        startTime:
          this.date && this.date[0]
            ? moment(this.date[0]).format('YYYY-MM-DD 00:00:00')
            : undefined,
        endTime:
          this.date && this.date[1]
            ? moment(this.date[1]).format('YYYY-MM-DD 23:59:59')
            : undefined
      };
      const { data } = await Api.getCustomDetailInfo(queryData);
      runInAction(() => {
        this.threeDPhotoDatas = data;
      });
    } catch (error) {}
  }
  @action.bound
  @lockAsync
  async getComparedModel() {
    try {
      const { data } = await Api.getCustomCompareInfo({
        customId: this.customId,
        title: this.title,
        editor: this.editor
      });
      runInAction(() => {
        this.compareListPhoto = data;
      });
    } catch (error) {}
  }
  @computed get photoDatas() {
    let data: IChildren[] = [];
    this.threeDPhotoDatas.forEach(item => {
      item.child.forEach(childItem => {
        childItem.children.forEach(childrenItem => {
          data.push(childrenItem);
        });
      });
    });
    return data;
  }
  @action.bound
  @lockAsync
  async getProjectData() {
    try {
      const { data } = await Api.getCustomProjectInfo(this.customId);
      runInAction(() => {
        this.projectOption = data.map((item: { name: string; id: string }) => {
          return { label: item.name, value: item.id };
        });
      });
    } catch (error) {}
  }
  @action.bound
  changeTime(date: RangePickerValue) {
    this.date = date;
    this.get3DMdelInfo();
  }
  @action.bound
  setComparedData(data: IComparedDatas) {
    data.id = 'model' + this.comparedDatas.length;
    const comparedData = [...this.comparedDatas];
    comparedData.push(data);
    this.comparedDatas = comparedData;
  }
  // 照片拖拽术前drop 事件
  @action.bound
  leftDomDrop(index: number) {
    if (this.tabActive === 'normal') {
      // 3d模型
      if (this.photoType === 2) {
        message.warning('请选择术前模型');
        return;
      }
      const data = cloneDeep(this.comparedDatas);
      // 术前模型信息
      data[index] = Object.assign(data[index], {
        modelUrl: this.photoDragData.url,
        modelId: this.photoDragData.id,
        labels: this.photoDragData.labels,
        modelState: 1 // 左边术前模型
      });
      this.comparedDatas = data;
      return;
    }
    // 以对比模型拖拽数据替换
    this.comparedDatas = this.comparedDragData ? this.comparedDragData : [];
  }
  @action.bound
  rightDomDrop(index: number) {
    if (this.tabActive === 'normal') {
      if (this.photoType === 1) {
        message.warning('请选择术后模型');
        return;
      }
      const data = cloneDeep(this.comparedDatas);
      // 术后模型信息
      data[index] = Object.assign(data[index], {
        modelUrlRight: this.photoDragData.url,
        modelIdRight: this.photoDragData.id,
        labelsRight: this.photoDragData.labels,
        modelStateRight: 2 // 右边术后模型
      });
      this.comparedDatas = data;
      return;
    }
    // 以对比模型拖拽数据替换
    this.comparedDatas = this.comparedDragData ? this.comparedDragData : [];
  }
  @action.bound
  photoDragStart(data: any) {
    this.photoDragData = data;
  }
  @action.bound
  photoDragEnd() {
    this.photoDragData = null;
  }
  @action.bound
  setComparedDragData(data: IModels[][], isDrag?: boolean) {
    let comparedData: IComparedDatas[] = [];
    data.forEach((item: IModels[], index: number) => {
      // modelState 1 代表左边术前模型， 2 右边术后模型 和 3d模型的术前术后模拟没有关系
      if (item[0].modelState === 1) {
        const data = {
          modelUrl: item[0].modelPath,
          modelId: item[0].modelId,
          modelState: item[0].modelState,
          labels: item[0].labels,
          modelUrlRight: item[1].modelPath,
          labelsRight: item[1].labels,
          modelIdRight: item[1].modelId,
          modelStateRight: item[1].modelState,
          id: 'model' + index
        };
        comparedData.push(data);
      } else {
        const data = {
          modelUrl: item[1].modelPath,
          modelId: item[1].modelId,
          modelState: item[1].modelState,
          labels: item[1].labels,
          modelUrlRight: item[0].modelPath,
          modelIdRight: item[0].modelId,
          labelsRight: item[0].labels,
          modelStateRight: item[0].modelState,
          id: 'model' + index
        };
        comparedData.push(data);
      }
    });
    if (isDrag) {
      this.comparedDragData = comparedData;
      return;
    }
    this.comparedDatas = comparedData;
  }
  @action.bound
  comparedDragEnd() {
    this.comparedDragData = null;
  }
  @action.bound
  setConfirmLoading = () => {
    this.confirmLoading = !this.confirmLoading;
  };
  @action.bound
  @lockAsync
  async saveComparedModel(param: object) {
    try {
      ModelComparedServer.saveCompareModel(
        Object.assign(param, {
          customId: this.customId,
          compareModelId: this.compareModelId ? this.compareModelId : undefined
        })
      )
        .then((res: IMODApiData) => {
          if (res.code === 10000) {
            message.success('操作成功');
            if (this.drawerVisible && this.tabActive === 'compare') {
              this.getComparedModel();
            }
            this.compareModelId && this.getComparedInfo(this.compareModelId);
          }

          this.changeVisible();
        })
        .finally(() => {
          runInAction(() => {
            this.confirmLoading = false;
          });
        });
    } catch (error) {}
  }
  @action.bound
  @lockAsync
  async uploadPhoto(dataUrl: any) {}
  @action.bound
  titleChange(value: any) {
    if (value.target.value === this.title) {
      return;
    }
    this.title = value.target.value.trim();
    this.getComparedModel();
  }
  @action.bound
  seaveTitleChange(e: any, saveValue?: string) {
    if (saveValue) {
      this.numberLimit = saveValue;
      return;
    }
    this.numberLimit = e.target.value.trim();
  }
  @action.bound
  @lockAsync
  async getEditorOption(id: string) {
    try {
      const { data, code } = await Api.getEditorInfo(id);
      runInAction(() => {
        if (code === 10001) {
          this.editorOption = data;
        }
      });
    } catch (error) {}
  }
  @action.bound
  onChangeEditor(e: string) {
    this.editor = e;
    this.getComparedModel();
  }
  @action.bound
  @lockAsync
  async getComparedInfo(id: string) {
    try {
      const { data, code } = await ModelComparedServer.getCompareModelInfo(id);
      if (code === 10001) {
        runInAction(() => {
          const info = {
            title: data.title,
            modifyDate: data.modifyDate,
            keyUid: data.keyUid
          };
          this.editInfo = info;
          this.compareModelId = id;
          this.setComparedDragData(data.models);
        });
      }
    } catch (error) {}
  }
  @action.bound
  featurePointsShow(e: CheckboxChangeEvent) {
    this.showFeaturePoints = e.target.checked;
  }
  @action.bound
  getUploadToken(key?: string) {
    return ModelComparedServer.getUploadToken(key);
  }
}
export default new ModelComparedStore();
export interface IModelComparedStore extends ModelComparedStore {}
