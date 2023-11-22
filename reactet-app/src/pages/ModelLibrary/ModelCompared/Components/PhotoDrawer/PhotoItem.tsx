import React, { FC, useContext } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import NGNoData from 'components/QUNoData';
import { useStore, observer } from 'store/utils';
import globalConfig from 'global/globalConfig';
interface IProps {
  data?: any;
  onClick?: (data: any) => void;
}

const PhotoItem = (props: IProps) => {
  const { ModelComparedStore } = useStore();
  const { onClick } = props;
  const listPhoto: any[] = [];
  const activeId = '1111';
  const handleClick = (i: any) => {
    onClick && onClick(i);
  };

  return (
    <>
      {ModelComparedStore.photoDatas.length === 0 ? (
        <NGNoData />
      ) : (
        ModelComparedStore.photoDatas.map((i: any) => (
          <div
            className={`photo_edit_drawer_photoItem ${
              i.id === activeId ? 'active_photo' : ''
            }`}
            onClick={() => {
              handleClick(i);
            }}
            key={i.modelId}
          >
            <div
              className="photo_edit_drawer_photoItem_img"
              draggable={true}
              data-id={i.modelId}
              data-url={i.modelPath}
              data-labels={i.modelLabels}
              style={{
                backgroundImage: `url(${globalConfig.qiuniu +
                  i.modelId}/coverPicture.png?time=${+new Date()}&imageView2/1/w/356/h/200 )`
              }}
            >
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
              />
            </div>
            <div className="photo_edit_drawer_photoItem_info">
              <span className="photo_edit_drawer_photoItem_info_time">
                {moment(i.updateDate).format('YYYY-MM-DD')}
              </span>
              <Tooltip title={i.projectName}>
                <span className="photo_edit_drawer_photoItem_info_name">
                  {i.projectName}
                </span>
              </Tooltip>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default observer(PhotoItem);
