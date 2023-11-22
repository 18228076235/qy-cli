import React, { SFC, memo } from 'react';
import SidebarItem from './SidebarItem';
import UserInfo from './UserInfo';
const menuList = [
  {
    url: '/app/ModelLibrary',
    title: '模型库',
    icon: 'icon-d'
  },
  {
    url: '/app/account',
    title: '账户管理',
    icon: 'icon-zhanghuguanli'
  }
];
const SidebarList: SFC = () => {
  return (
    <React.Fragment>
      {menuList.map(item => (
        <div key={item.url}>
          <SidebarItem {...item} />
        </div>
      ))}
      <UserInfo />
    </React.Fragment>
  );
};

export default SidebarList;
