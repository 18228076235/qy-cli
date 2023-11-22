/*
 * @Author: huxianyong
 * @Date: 2019-11-26 15:09:25
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-12-05 19:57:39
 */
import React, { memo } from 'react';
import { Button } from 'antd';
import './ModelLibraryDrawer.scss';
import { useStore, observer } from 'store/utils';
import LazyPhotoItem from './LazyPhotoItem';
import QUNoData from 'components/QUNoData';
import QUEllipsis from 'components/QUEllipsis';
import moment from 'moment';
import globalConfig from 'global/globalConfig';
const ContrastModel = () => {
  const { ModelLibraryStore } = useStore();
  const { DrawerStore } = ModelLibraryStore;
  function getPhotoItem() {
    const photoList: any = DrawerStore.contrastPhoto;
    return photoList && photoList.length ? (
      <div className="flex_wrap">
        {photoList.map((item: any) => (
          <div
            className="comparedPhotos_content_item"
            key={item.compareModelId}
          >
            <LazyPhotoItem
              id={item.compareModelId}
              path={
                globalConfig.qiuniu +
                item.coverPath +
                `?time=${+new Date()}&imageView2/1/w/356/h/200`
              }
            >
              <div className="flex_sb">
                <span>
                  {item.modifyDate
                    ? moment(item.modifyDate).format('YYYY-MM-DD')
                    : '-'}
                  <QUEllipsis val={item.title} len={8} className="ml-4" />
                </span>
                <span style={{ position: 'relative' }}>
                  <QUEllipsis val={`编辑人:${item.editor}`} len={8} />
                </span>
              </div>
            </LazyPhotoItem>
          </div>
        ))}
      </div>
    ) : (
      <QUNoData />
    );
  }
  return (
    <div className="comparedPhotos comparedPhotos_content">
      {getPhotoItem()}
    </div>
  );
};
export default observer(ContrastModel);
