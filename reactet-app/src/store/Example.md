```js
import { BaseStore } from './BaseStore';
import { observable, useStore } from './utils';
import { useUnmount } from 'hooks';
class T extends BaseStore {
  @observable key1 = {};
  @observable key2 = {};
  reset() {
    // 不会重置key1
    this.resetStore({
      exclude: ['key1']
    });
  }
}
// 在组件中使用
function C() {
  const { T } = useStore();
  useUnmount(() => {
    T.reset();
  });
}
```
