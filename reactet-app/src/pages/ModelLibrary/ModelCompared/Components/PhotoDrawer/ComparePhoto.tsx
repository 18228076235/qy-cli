import React, { FC, useContext } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import NGNoData from 'components/QUNoData';
import { observer, useStore } from 'store/utils';
import globalConfig from 'global/globalConfig';
interface IProps {
  onClick?: (data: any) => void;
}

const ComparePhotoItem = (props: IProps) => {
  const { ModelComparedStore } = useStore();
  const { onClick } = props;
  // const { compareListPhoto, activeId } = useContext(PhotoContext);
  const handleClick = (data: any) => {
    onClick && onClick(data);
  };
  const activeId = '';
  return (
    <div>
      {!!!ModelComparedStore.compareListPhoto ||
      ModelComparedStore.compareListPhoto.length === 0 ? (
        <NGNoData />
      ) : (
        ModelComparedStore.compareListPhoto.map((i: any) => (
          <div
            className={`photo_edit_drawer_comparePhoto ${
              i.compareModelId === activeId ? 'active_photo' : ''
            }`}
            onClick={() => {
              handleClick(i);
            }}
            key={i.compareModelId}
          >
            <div
              className="photo_edit_drawer_comparePhoto_img"
              draggable={true}
              style={{
                backgroundImage: `url(${globalConfig.qiuniu +
                  i.coverPath}?time=${+new Date()})`
              }}
              data-models={JSON.stringify(i.models)}
            >
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
              />
            </div>
            <div className="photo_edit_drawer_comparePhoto_info flex wes">
              <span className="photo_edit_drawer_comparePhoto_info_time">
                {i.modifyDate
                  ? moment(i.modifyDate).format('YYYY-MM-DD')
                  : moment(Date.now()).format('YYYY-MM-DD')}
              </span>

              <div className="photo_edit_drawer_comparePhoto_info_name ">
                <Tooltip title={i.title}>
                  <span className="photo_edit_drawer_comparePhoto_info_name_container ">
                    {i.title}
                  </span>
                </Tooltip>
              </div>

              <span className="photo_edit_drawer_comparePhoto_info_doctor wes">
                编辑人：{i.editor}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default observer(ComparePhotoItem);
