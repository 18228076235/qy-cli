/*
 * @Author: huxianyong
 * @Date: 2019-11-29 16:44:04
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-29 17:17:09
 */
export interface IOption {
  label: string;
  value: string;
}
export interface IPhotoDatas {
  projectName: string;
  child: IPhotoDarasChild[];
}
export interface IPhotoDarasChild {
  tiem: string;
  children: IChildren[];
}
export interface IChildren {
  customId: string;
  modelId: string;
  modelLabels: string;
  modelPath: string;
  modelState: number;
  projectId: string;
  projectName: string;
  updateDate: string;
}
export interface IComparedDatas {
  modelUrl?: string;
  modelId?: string;
  modelState?: number;
  modelUrlRight?: string;
  modelIdRight?: string;
  labels?: string;
  labelsRight?: string;
  modelStateRight?: number;
  id?: string;
}
export interface IModels {
  imgPath: string;
  labels: string;
  landmark: string;
  modelId: string;
  modelPath: string;
  modelState: number;
}
