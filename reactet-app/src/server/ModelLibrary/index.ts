import Axios from 'utils/Axios';

const apiUrl = {
  customerManage: '/api/custom/getAllCustomInfo',
  searchCustomInfo: '/api/custom/getProjectInfo',
  getCustomDetailInfo: '/api/custom/getCustomDetailInfo',
  editThreeDInfo: '/api/model/updateModelInfo',
  getCustomProjectInfo: '/api/custom/getProjectInfoByCustomId',
  getCustomCompareInfo: '/api/custom/getCustomCompareModelInfo',
  deleteThreeModel: '/api/model/deleteModel',
  getEditorInfo: '/api/custom/getCompareModelEditor',
  deleteCompareModel: '/api/model/deleteCompareModel',
  getModelInfo: '/api/model/getModelInfo',
  updateModel: '/api/model/updateModel'
};

const customerManage = (params: object) =>
  Axios.getInstance().get(apiUrl.customerManage, { params });
const getCustomDetailInfo = (data: object) =>
  Axios.getInstance().post(apiUrl.getCustomDetailInfo, { data });
const getCustomProjectInfo = (customId: string) =>
  Axios.getInstance().get(apiUrl.getCustomProjectInfo, {
    params: { customId }
  });
const editThreeDInfo = (params: object) =>
  Axios.getInstance().put(apiUrl.editThreeDInfo, { data: params });
const getCustomCompareInfo = (data: object) =>
  Axios.getInstance().post(apiUrl.getCustomCompareInfo, { data });
const deleteThreeModel = (modelId: object) => {
  return Axios.getInstance().delete(apiUrl.deleteThreeModel, {
    params: modelId
  });
};
const getEditorInfo = (customId: string) =>
  Axios.getInstance().get(apiUrl.getEditorInfo, {
    params: { customId }
  });
const deleteCompareModel = (params: object) =>
  Axios.getInstance().delete(apiUrl.deleteCompareModel, { params });

const getModelInfo = (params: object) =>
  Axios.getInstance().get(apiUrl.getModelInfo, { params });

const updateModel = (data: object) =>
  Axios.getInstance().post(apiUrl.updateModel, { data });
export default {
  customerManage,
  getCustomDetailInfo,
  getCustomProjectInfo,
  editThreeDInfo,
  getCustomCompareInfo,
  deleteThreeModel,
  getEditorInfo,
  deleteCompareModel,
  getModelInfo,
  updateModel
};
