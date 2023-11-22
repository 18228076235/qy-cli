import { BaseStore } from './BaseStore';
import { action, observable } from './utils';
class Test extends BaseStore {
  @observable name: string = '我是name初始值';
  @observable obj: { [x: string]: any } = { a: '我是obj初始值' };
  @observable array: any[] = [{ a: '我是数组初始值' }];
  constructor() {
    super();
    this.setInitialState();
  }
  @action.bound
  changeName() {
    this.name = '我是name被修改了';
  }
  @action.bound
  changeObj() {
    this.obj.a = '我是obj被修改了';
  }
  @action.bound
  changeArray() {
    this.array[0].a = '我是数组被修改了';
  }

  reset(params?: any) {
    this.resetStore(params);
  }
}
describe('BaseStore', () => {
  it('test BaseStore resetStore all', () => {
    const Store = new Test();
    Store.changeName();
    expect(Store.name).toBe('我是name被修改了');
    Store.changeArray();
    expect(Store.array[0].a).toBe('我是数组被修改了');
    Store.changeObj();
    expect(Store.obj.a).toBe('我是obj被修改了');

    Store.reset();
    expect(Store.name).toBe('我是name初始值');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj初始值');
  });
  it('test BaseStore resetStore with params', () => {
    const Store = new Test();
    Store.changeName();
    expect(Store.name).toBe('我是name被修改了');
    Store.changeArray();
    expect(Store.array[0].a).toBe('我是数组被修改了');
    Store.changeObj();
    expect(Store.obj.a).toBe('我是obj被修改了');
    // both
    Store.reset({
      exclude: ['obj'],
      include: ['array']
    });
    expect(Store.name).toBe('我是name被修改了');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj被修改了');
    // only one
    Store.changeName();
    expect(Store.name).toBe('我是name被修改了');
    Store.reset({
      include: ['name']
    });
    expect(Store.name).toBe('我是name初始值');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj被修改了');

    Store.reset({
      exclude: ['name']
    });
    expect(Store.name).toBe('我是name初始值');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj初始值');

    Store.changeName();
    expect(Store.name).toBe('我是name被修改了');
    Store.changeArray();
    expect(Store.array[0].a).toBe('我是数组被修改了');
    Store.reset({
      exclude: ['obj']
    });
    expect(Store.name).toBe('我是name初始值');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj初始值');

    Store.changeName();
    expect(Store.name).toBe('我是name被修改了');
    Store.changeArray();
    expect(Store.array[0].a).toBe('我是数组被修改了');
    Store.changeObj();
    expect(Store.obj.a).toBe('我是obj被修改了');
    Store.reset({
      include: ['name', 'array']
    });
    expect(Store.name).toBe('我是name初始值');
    expect(Store.array[0].a).toBe('我是数组初始值');
    expect(Store.obj.a).toBe('我是obj被修改了');
  });
});
