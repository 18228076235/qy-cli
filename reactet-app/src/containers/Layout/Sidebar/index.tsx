import React, { SFC, useState } from 'react';
import SidebarList from './SidebarList';
import './index.scss';
import QUIcon from 'components/QUIcon';
const Sidebar: SFC = () => {
  return (
    <div className="ngLayout_sidebar-default">
      <div className="sidebar_item_logo">
        <QUIcon
          className="iconfont fs-46 pt-12 pb-12"
          icon="icon-neuron_white"
        />
      </div>
      <div className="ngLayout_sidebar_menu">
        <SidebarList />
      </div>
    </div>
  );
};

export default Sidebar;
