/** @format */

import React, { SFC, useEffect } from 'react';
import { useRouter } from 'hooks';
import QUIcon from 'components/QUIcon';
export interface ISidebarItem {
  url: string;
  title: string;
  icon: string;
}
const SidebarItem: SFC<ISidebarItem> = ({ url, title, icon }) => {
  const { history, location } = useRouter();
  function getPath(url: string) {
    return url.split('/')[2];
  }

  const jumpRouter = () => {
    history.push(url);
  };
  return (
    <div
      className={
        getPath(location.pathname) === getPath(url)
          ? 'sidebar_item sidebar_item-active'
          : 'sidebar_item'
      }
      onClick={jumpRouter}
    >
      <QUIcon className={`iconfont fs-24`} icon={`${icon}`} />
      <span>{title}</span>
    </div>
  );
};
export default SidebarItem;
