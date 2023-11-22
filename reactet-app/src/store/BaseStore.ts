import { action, toJS } from 'mobx';
interface IArg {
  exclude?: string[];
  include?: string[];
}
class BaseStore {
  private _superInitialState: any;

  @action.bound
  public setInitialState() {
    this._superInitialState = toJS(this, {
      exportMapsAsObjects: false
    });
  }

  @action.bound
  private resetAll(initialState: any) {
    Object.keys(initialState).forEach(key => {
      if (key !== '_superInitialState') {
        // @ts-ignore
        this[key] = initialState[key];
      }
    });
  }
  @action.bound
  public resetStore(params?: IArg) {
    const initialState = { ...this._superInitialState };
    if (!this._superInitialState)
      throw new Error('call setInitialState in constructor');
    if (params) {
      // both
      if (params.include && params.exclude) {
        Object.keys(initialState).forEach(key => {
          const flag = key !== '_superInitialState';
          if (
            flag &&
            //@ts-ignore
            !params.exclude.includes(key) &&
            //@ts-ignore
            params.include.includes(key)
          ) {
            //@ts-ignore
            this[key] = initialState[key];
          }
        });
        return;
      }
      if (params.include || params.exclude) {
        if (params.include) {
          Object.keys(initialState).forEach(key => {
            const flag = key !== '_superInitialState';
            //@ts-ignore
            if (flag && params.include.includes(key)) {
              //@ts-ignore
              this[key] = initialState[key];
            }
          });
          return;
        }
        if (params.exclude) {
          Object.keys(initialState).forEach(key => {
            const flag = key !== '_superInitialState';
            //@ts-ignore
            if (flag && !params.exclude.includes(key)) {
              //@ts-ignore
              this[key] = initialState[key];
            }
          });
          return;
        }
      }
    }
    this.resetAll(initialState);
  }
}

export { BaseStore };
