/** @format */

import React from 'react';
import {
  observable,
  configure,
  action,
  computed,
  toJS,
  runInAction
} from 'mobx';
import {
  useLocalStore,
  observer,
  inject,
  MobXProviderContext
} from 'mobx-react';
import { useObserver } from 'mobx-react-lite';
import { IStore } from '.';

if (process.env.NODE_ENV !== 'test') {
  configure({ enforceActions: 'always' });
}

function withMobx<T, K extends keyof T>(
  ComponentClass: React.ComponentType<T>,
  ...stores: K[] | (keyof IStore)[]
): React.ComponentType<Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>> {
  return inject(...(stores as string[]))(observer(ComponentClass)) as any;
}

function useStore() {
  const store = React.useContext<any>(MobXProviderContext);
  return store;
}

function lockAsync(
  _: object,
  funcName: string | symbol,
  descriptor: PropertyDescriptor
) {
  const { list, locks } = {
    list: {},
    locks: 'asyncLocks'
  } as any;
  list[locks] = list[locks] || {};
  const id = funcName;
  const value = descriptor.value;

  descriptor.value = function() {
    if (list[locks][id]) return;
    list[locks][id] = true; // 操作开始
    const res = value.call(this, ...arguments) as Promise<any>;
    if (Object.prototype.toString.call(res) === '[object Promise]') {
      res.finally(() => {
        list[locks][id] = false;
      });
    } else {
      console.error('该函数不是async', funcName);
      list[locks][id] = false;
    }
    return res;
  };
}

export {
  observable,
  action,
  computed,
  useLocalStore,
  observer,
  inject,
  useObserver,
  useStore,
  toJS,
  lockAsync,
  withMobx,
  runInAction
};
