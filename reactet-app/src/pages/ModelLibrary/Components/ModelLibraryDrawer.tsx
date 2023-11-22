/*
 * @Author: huxianyong
 * @Date: 2019-11-22 14:49:27
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:54:53
 */
import React from 'react';
import { Tabs, Select, DatePicker, Checkbox, Input, Button } from 'antd';
import './ModelLibraryDrawer.scss';
import { useStore, observer } from 'store/utils';
import QUDrawer from 'components/QUDrawer';
import QUPrivacyInfo from 'components/QUPrivacyInfo';
import ThreeDPhotos from './ThreeDPhotos';
import ContrastModel from './ContrastModel';
import { withRouter, RouteComponentProps } from 'react-router';
import { useUnmount } from 'hooks';
import EditModal from './EditModal';
import { EType } from 'store/ModelLibrary/interface';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const ModelLibraryDrawer = (props: RouteComponentProps) => {
  const { ModelLibraryStore } = useStore();
  const { ListStore, DrawerStore } = ModelLibraryStore;
  function onTabsChange(key: EType) {
    DrawerStore.typeChange(key);
  }
  function goToPage() {
    props.history.push(
      `/app/ModelLibrary/ModelCompared/${DrawerStore.customId}`
    );
  }
  function getEditModal() {
    return <EditModal></EditModal>;
  }
  useUnmount(() => {
    DrawerStore.resetStore();
  });
  return (
    <QUDrawer
      visible={ListStore.drawerVisible}
      closeDrawer={ListStore.changeDrawerVisible}
    >
      <div className="modelLibraryDrawer">
        {getEditModal()}
        <div className="modelLibraryDrawer_customer flex">
          <span className="fs-20 mr-12">{DrawerStore.customerName}</span>
          <QUPrivacyInfo defaultShow={DrawerStore.customerPhone} isPhone />
        </div>
        <Tabs
          onChange={onTabsChange}
          tabBarExtraContent={<Button onClick={goToPage}>模型对比</Button>}
          activeKey={DrawerStore.type}
        >
          <TabPane key={EType.THREEMODAL} tab="3d模型">
            <div className="modelLibraryDrawer_search modelLibraryDrawer_search_3d flex_left">
              <div className="mr-30">
                <span className="pr-8">项目</span>
                <Select
                  optionFilterProp="children"
                  showSearch
                  placeholder="请输入"
                  className="w-200"
                  mode="multiple"
                  onChange={DrawerStore.onProjectChange}
                  allowClear
                >
                  {DrawerStore.projectOption.map((item: any) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <div className="mr-30">
                <span className="pr-8">上传日期</span>
                <DatePicker.RangePicker
                  onChange={DrawerStore.onDateChange}
                  allowClear
                  className="w-220"
                />
              </div>
              <div className="mr-30">
                <span className="pr-8">照片类型</span>
                <CheckboxGroup
                  onChange={DrawerStore.chooseState}
                  options={[
                    { label: '术前', value: '1' },
                    { label: '术后', value: '2' },
                    { label: '模拟', value: '3' }
                  ]}
                />
              </div>
            </div>
            <ThreeDPhotos />
          </TabPane>
          <TabPane key={EType.COMPAREDMODAL} tab="已对比模型">
            <div className="modelLibraryDrawer_search flex_left">
              <div className="mr-30">
                <span className="pr-8">对比标题</span>
                <Input
                  className="w-200"
                  placeholder="请输入"
                  onBlur={DrawerStore.getTitle}
                />
              </div>
              <div className="mr-30">
                <span className="pr-8">编辑人</span>
                <Select
                  placeholder="请输入或选择"
                  allowClear
                  onChange={DrawerStore.chooseEditor}
                >
                  {DrawerStore.editorList.map((item:any) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <ContrastModel />
          </TabPane>
        </Tabs>
      </div>
    </QUDrawer>
  );
};
export default withRouter(observer(ModelLibraryDrawer));
