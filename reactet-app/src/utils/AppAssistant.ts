import { AccountServer } from 'server';
import LoginStore from 'store/Login';
import { createHashHistory } from 'history';
class AppAssistant {
  private static instance: AppAssistant;
  private token = localStorage.getItem('token') || '';
  static getInstance() {
    if (!this.instance) {
      return new AppAssistant();
    }
    return this.instance;
  }
  public async initApp() {
    this.checkToken();
    await this.getLoginInfo();
  }
  public logout() {
    localStorage.removeItem('token');
    window.location.replace(`${location.origin}`);
  }

  private checkToken() {
    if (!this.token && location.hash !== '#/login') {
      window.location.replace(`#/login`);
    }
  }
  private async getLoginInfo() {
    if (this.token) {
      try {
        const histoty = createHashHistory();
        const res = await AccountServer.getUserInfoByToken({
          token: this.token
        });
        if (res.code === 10001) {
          LoginStore.setLoginInfo({
            userInfo: res.data,
            token: this.token
          });
          if (location.hash === '#/login') {
            histoty.replace('/');
          }
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }
}

export default AppAssistant;
