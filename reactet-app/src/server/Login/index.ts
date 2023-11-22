/** @format */

import Axios, { IApiData } from 'utils/Axios';

export interface IMODApiData extends IApiData {}
const apiUrl = {
  login: '/api/v1/loginOnApp'
};

const login = (params: object) =>
  Axios.getInstance().post(apiUrl.login, { data: params });

export default {
  login
};
