import React, { FC, useContext, useEffect, useState } from 'react';

import { DatePicker, Spin } from 'antd';
import TypeButton from './TypeButton';
import PhotoItem from './PhotoItem';
import { useStore, observer, toJS } from 'store/utils';
interface IProps {
  photoClick?: (data: any) => void;
  addImg?: (data: any) => void;
  changeProject: (data: any) => void;
  changeType: (data: any) => void;
  changeTime: (_: any, time: string[]) => void;
}
const { RangePicker } = DatePicker;
const types = [
  {
    label: '术前',
    value: 1
  },
  {
    label: '术后',
    value: 2
  },
  {
    label: '模拟',
    value: 3
  }
];
const Normal = (props: IProps) => {
  // const { projectLabel, activeProject, photoType, loading } = useContext(
  //   PhotoContext
  // );
  const { ModelComparedStore } = useStore();
  const loading = false;
  const {} = useState();
  return (
    <div className="photo_edit_drawer_normal">
      <div className="photo_edit_drawer_normal_type">
        {ModelComparedStore.projectOption.map((item:any) => {
          return (
            <TypeButton
              name={item.label}
              style={{ width: '100%', marginTop: 8 }}
              key={item.value}
              onClick={() => {
                ModelComparedStore.changeProject(item.value);
              }}
              active={ModelComparedStore.activeProject.has(item.value)}
            />
          );
        })}
      </div>
      <div className="photo_edit_drawer_normal_list" id="photo_list_box">
        <div>
          {types.map(i => (
            <TypeButton
              name={i.label}
              style={{ padding: '2px 4px', marginRight: 4 }}
              active={ModelComparedStore.photoType === i.value}
              key={i.value}
              onClick={() => {
                ModelComparedStore.changeType(i.value);
              }}
            />
          ))}
        </div>
        <RangePicker
          placeholder={['开始日期', '结束日期']}
          style={{ width: '100%', marginTop: 8 }}
          onChange={ModelComparedStore.changeTime}
        />
        <Spin spinning={loading}>
          <PhotoItem onClick={props.photoClick} />
        </Spin>
      </div>
    </div>
  );
};

export default observer(Normal);
