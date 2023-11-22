import React, { FC, useContext, useEffect, useState, useCallback } from 'react';
import { Input, Button, Spin, Select } from 'antd';
import ComparePhoto from './ComparePhoto';
import { useStore, observer } from 'store/utils';
interface IProps {
  photoClick?: (data: any) => void;
}

const Compare: FC<IProps> = props => {
  const [users, setUsers] = useState<any[]>([]);
  // useEffect(() => {
  //   Api.getUserAll().then((res: any) => {
  //     if (res.code === 10001) {
  //       setUsers(res.data);
  //     }
  //   });
  // }, []);
  const { ModelComparedStore } = useStore();
  const loading = false;
  const onChange = () => {};
  return (
    <div className="photo_edit_drawer_compare">
      <div className="flex">
        <Input
          className="photo_edit_drawer_compare_photoName"
          placeholder="输入对比标题搜索"
          allowClear={false}
          onBlur={ModelComparedStore.titleChange}
          onPressEnter={ModelComparedStore.titleChange}
          style={{
            marginRight: '12px'
          }}
        />
        <Select
          className="photo_edit_drawer_compare_editor"
          placeholder="编辑人"
          allowClear
          onChange={ModelComparedStore.onChangeEditor}
        >
          {ModelComparedStore.editorOption.map(
            (item: { id: string; name: string }) => (
              <Select.Option key={item.id} value={item.id}>
                {' '}
                {item.name}
              </Select.Option>
            )
          )}
        </Select>
      </div>
      <div className="photo_edit_drawer_compare_list" id="compare_photo_box">
        <Spin spinning={loading}>
          <ComparePhoto onClick={props.photoClick} />
        </Spin>
      </div>
    </div>
  );
};

export default observer(Compare);
