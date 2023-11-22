/*
 * @Author: huxianyong
 * @Date: 2019-12-03 11:20:53
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-12-05 20:46:17
 */
import Axios from 'utils/Axios';
const apiUrl = {
  filesUpload: '/api/v1/upload/files',
  saveCompareModel: '/api/model/saveCompareModel',
  getCompareModelInfo: '/api/model/getCompareModelInfo',
  getUploadToken: '/api/v1/upload/getUploadToken'
};
const filesUpload = (data: object) =>
  Axios.getInstance().post(apiUrl.filesUpload, { data });
const saveCompareModel = (data: object) =>
  Axios.getInstance().post(apiUrl.saveCompareModel, { data });
const getCompareModelInfo = (compareModelId: string) =>
  Axios.getInstance().get(apiUrl.getCompareModelInfo, {
    params: { compareModelId }
  });
const getUploadToken = (key?: string) =>
  Axios.getInstance().get(apiUrl.getUploadToken, { params: { key } });
export default {
  filesUpload,
  saveCompareModel,
  getCompareModelInfo,
  getUploadToken
};
