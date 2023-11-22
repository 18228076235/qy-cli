import { LoginServer } from 'server';
import { observable, action, runInAction, lockAsync } from '../utils';
import { IErrorInfo, EERRORCODE } from './interface';
import { message } from 'antd';

const loginInfo = {
  token: '',
  userInfo: {
    createBy: '',
    createDate: 0,
    delFlag: 0,
    id: '',
    name: '',
    password: '',
    phone: '',
    pinyin: '',
    seeFlag: 0,
    sex: 0,
    simPinyin: '',
    tenantId: '',
    type: 0,
    updateBy: '',
    updateDate: 0,
    userNo: '',
    username: ''
  }
};

const qrCodeObj = {
  name: '',
  account: '',
  identifier: '3d-test/test',
  date: +new Date(),
  system: '3D'
};
type TQrCodeObj = typeof qrCodeObj;
type TLoginInfo = typeof loginInfo;
class LoginStore {
  @observable loginInfo: TLoginInfo;
  @observable username: string = '';
  @observable password: string = '';
  @observable isRemember: boolean = false;
  @observable isLoading: boolean = false;
  @observable passwordView: boolean = false;
  @observable year: any = new Date().getFullYear();

  @observable errorInfo: IErrorInfo = {
    type: '',
    message: ''
  };
  @observable qrCodeStr: TQrCodeObj = qrCodeObj;

  @action.bound
  changeRemember(flag: boolean) {
    this.isRemember = flag;
  }
  @action.bound
  changeInput(type: string, value: string) {
    switch (type) {
      case 'account':
        this.username = value;
        break;
      case 'password':
        this.password = value;
        break;
      default:
        return;
    }
  }

  @action.bound
  changeLoading(flag: boolean) {
    this.isLoading = flag;
  }

  @action.bound
  changeError(data: IErrorInfo) {
    this.errorInfo = data;
  }
  @action.bound
  setLoginInfo(data: TLoginInfo) {
    this.loginInfo = data;
    const qrData = {
      name: data.userInfo.name,
      account: data.userInfo.username,
      identifier: '3d-test/test',
      date: +new Date(),
      system: '3D'
    };
    this.qrCodeStr = qrData;
  }

  @action.bound
  @lockAsync
  async callLogin(cb?: Function) {
    try {
      const { data } = await LoginServer.login({
        account: this.username.trim(),
        password: this.password
      });
      //  记住账号功能
      if (this.isRemember) {
        localStorage.setItem('account', this.username);
      } else {
        localStorage.removeItem('account');
      }
      this.setLoginInfo(data);
      localStorage.setItem('token', data.token);
      this.changeLoading(false);
      cb && cb();
    } catch ({ code, msg }) {
      this.changeLoading(false);
      if (
        code === EERRORCODE.MOBILE_ERROR ||
        code === EERRORCODE.DISABLE_ACCOUNT ||
        code === EERRORCODE.USER_NOT_FOUND
      ) {
        this.changeError({ type: 'account', message: msg });
      } else if (code === EERRORCODE.USER_PASSWORD_ERRO) {
        this.changeError({ type: 'password', message: msg });
      }
    }
  }

  @action.bound
  changePasswordView() {
    this.passwordView = !this.passwordView;
  }
  @action.bound
  updateQRdate() {
    this.qrCodeStr = Object.assign(this.qrCodeStr, { date: +new Date() });
  }
}
export default new LoginStore();
export interface ILoginStore extends LoginStore {}
