/*
 * @Author: shiyao you
 * @Date: 2019-11-26 16:16:53
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:41:03
 */
import Axios from 'utils/Axios';

const apiUrl = {
  getAll: '/api/v1/user/getAll',
  addUser: '/api/v1/user/save',
  getUserListBy: '/api/v1/user/getUserByNameOrPhoneOrUserNo',
  deleteUser: '/api/v1/user/deleteUser',
  editUser: '/api/v1/user/updateUser',
  getUserInfoByToken: '/api/v1/user/getUserInfoByToken',
  editPwd: '/api/v1/user/updateSecret'
};

const getAll = (params: object) =>
  Axios.getInstance().get(apiUrl.getAll, { params });

const getUserListBy = (params: object) =>
  Axios.getInstance().get(apiUrl.getUserListBy, { params });

const saveUser = (params: object) =>
  Axios.getInstance().post(apiUrl.addUser, { data: params });

const deleteUser = (params: object) =>
  Axios.getInstance().get(apiUrl.deleteUser, { params });

const editUser = (params: object) =>
  Axios.getInstance().post(apiUrl.editUser, { params });

const getUserInfoByToken = (params: object) =>
  Axios.getInstance().get(apiUrl.getUserInfoByToken, { params });

const editPwd = (params: object) =>
  Axios.getInstance().post(apiUrl.editPwd, { params });

export default {
  getAll,
  getUserListBy,
  saveUser,
  deleteUser,
  editUser,
  getUserInfoByToken,
  editPwd
};
