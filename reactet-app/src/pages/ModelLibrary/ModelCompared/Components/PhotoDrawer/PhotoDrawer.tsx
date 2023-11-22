import React, { FC, memo, useContext } from 'react';
import { Tabs } from 'antd';
import Normal from './Normal';
import Compare from './Compare';
import './PhotoDrawer.scss';
import { observer, useStore } from 'store/utils';
import QUIcon from 'components/QUIcon';
const TabPane = Tabs.TabPane;

interface IProps {
  visible: boolean;
  onClose: (flag: boolean) => void;
  photoClick: (data: any) => void;
  changeTabs: (e: string) => void;
  activeId: string;
}

const PhotoDrawer = () => {
  const { ModelComparedStore } = useStore();
  const changeTime = () => {};
  const changeType = () => {};
  const changeProject = () => {};

  const handleClose = () => {
    ModelComparedStore.changeDrawerVisible();
  };
  const Content = (
    <div className="csp w-40 tc" onClick={handleClose}>
      <QUIcon icon="iconcollapse" className="csp" fontSize={14} />
    </div>
  );
  return (
    <div
      className={`photo_edit_drawer ${
        ModelComparedStore.drawerVisible ? 'photo_edit_drawer-active' : ''
      }`}
    >
      <Tabs
        onChange={ModelComparedStore.changeTabs}
        activeKey={ModelComparedStore.tabActive}
        tabBarGutter={10}
        tabBarExtraContent={Content}
      >
        <TabPane tab="3d模型" key="normal">
          <Normal
            changeTime={changeTime}
            photoClick={ModelComparedStore.photoClick}
            changeType={changeType}
            changeProject={changeProject}
          />
        </TabPane>

        <TabPane tab="已对比模型" key="compare" forceRender={true}>
          <Compare photoClick={ModelComparedStore.photoClick} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default observer(PhotoDrawer);
