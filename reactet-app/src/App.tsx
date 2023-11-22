/** @format */

import React from 'react';
import { AppRouter } from 'router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { Provider } from 'mobx-react';
import AllStores from 'store';

import 'style/index.scss';
import 'antd/dist/antd.less';
import './App.css';
import 'assets/Iconfonts/iconfont';

import QUErrorBoundary from 'components/QUErrorBoundary';
function App() {
  return (
    <QUErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <Provider {...AllStores}>
          <AppRouter />
        </Provider>
      </ConfigProvider>
    </QUErrorBoundary>
  );
}
export default App;
