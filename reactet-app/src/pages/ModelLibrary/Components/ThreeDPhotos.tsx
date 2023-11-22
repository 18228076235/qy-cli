/*
 * @Author: huxianyong
 * @Date: 2019-11-25 17:55:48
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-26 16:57:34
 */
import React, { Fragment } from 'react';
import { Button } from 'antd';
import './ModelLibraryDrawer.scss';
import { useStore, observer } from 'store/utils';
import LazyPhotoItem from './LazyPhotoItem';
import QUNoData from 'components/QUNoData';
import globalConfig from 'global/globalConfig';
const arr: any[] = ['术前', '术后', '模拟'];
const ModelLibrary = () => {
  const { ModelLibraryStore } = useStore();
  const { DrawerStore } = ModelLibraryStore;
  function getItem() {
    const { photoDatas } = DrawerStore;
    return photoDatas && photoDatas.length > 0 ? (
      photoDatas.map((item:any) => {
        return (
          <div className="modelLibraryDrawer_content" key={item.projectName}>
            <b>{item.projectName}</b>
            <div className="flex_wrap">
              {item.child.map((childItem: any, index: number) =>
                childItem.children.map((childrenItem: any) => (
                  <div
                    className="modelLibraryDrawer_content_item"
                    key={childrenItem.modelId}
                  >
                    <p
                      className={
                        index === 0
                          ? 'modelLibraryDrawer_time'
                          : 'modelLibraryDrawer_sameTime'
                      }
                    >
                      {childrenItem.updateDate.split(' ')[0]}
                    </p>
                    <LazyPhotoItem
                      id={childrenItem.modelId}
                      path={
                        globalConfig.qiuniu +
                        childrenItem.modelId +
                        '/coverPicture.png' +
                        `?time=${+new Date()}&imageView2/1/w/200/h/200`
                      }
                    >
                      <p>{arr[childrenItem.modelState - 1]}</p>
                    </LazyPhotoItem>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })
    ) : (
      <QUNoData />
    );
  }
  return <div className="modelLibraryDrawer_main">{getItem()}</div>;
};
export default observer(ModelLibrary);
