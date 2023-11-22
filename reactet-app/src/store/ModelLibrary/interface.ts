/*
 * @Author: huxianyong
 * @Date: 2019-11-25 17:25:17
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-02 17:10:40
 */

export interface IPhotoDatas {
  projectName: string;
  child: {
    time: number;
    children: {
      src: string;
      content: string;
    }[];
  }[];
}
export interface IQueryDrawerParam {
  customId: string;
  type: number;
}
export enum EType {
  /**3d模型 */
  THREEMODAL = '1',
  /**以对比模型 */
  COMPAREDMODAL = '2'
}
