import React from 'react';
import Loadable from 'react-loadable';
export interface IRouterItem {
  key: string;
  name: string;
  path: string;
  component:
    | (React.ComponentClass<{}, any> & Loadable.LoadableComponent)
    | (React.FunctionComponent<{}> & Loadable.LoadableComponent);
  childs?: IRouterItem[];
}

const RouterConfigs: any[] = [
  {
    key: 'true',
    name: '页面B',
    path: '/app/account',
    component: Loadable({
      loader: () => import('pages/Account'),
      loading: () => null
    })
  },
  {
    key: 'true',
    name: '模型库',
    path: '/app/ModelLibrary',
    component: Loadable({
      loader: () => import('pages/ModelLibrary'),
      loading: () => null
    }),
    childs: [
      {
        key: 'true',
        name: '模型编辑',
        path: '/app/ModelLibrary/ModelEdit',
        component: Loadable({
          loader: () => import('pages/ModelLibrary/ModelEdit'),
          loading: () => null
        })
      },
      {
        key: 'true',
        name: '模型对比',
        path:
          '/app/ModelLibrary/ModelCompared/:customId/:comparedId?/:isDetail?',
        component: Loadable({
          loader: () => import('pages/ModelLibrary/ModelCompared'),
          loading: () => null
        })
      }
    ]
  },
  {
    name: '登陆',
    path: '/app/login',
    component: Loadable({
      loader: () => import('pages/Login'),
      loading: () => null
    })
  },
  {
    name: '11',
    path: '/app/a',
    component: Loadable({
      loader: () => import('pages/A'),
      loading: () => null
    })
  }
];
export default RouterConfigs;
