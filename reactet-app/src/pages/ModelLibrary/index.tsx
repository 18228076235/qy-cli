/*
 * @Author: huxianyong
 * @Date: 2019-11-21 20:26:34
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-11-29 11:59:51
 */
import React, { useState } from 'react';
import { Button, Input, Table, Pagination } from 'antd';
import './index.scss';
import ModelLibraryDrawer from './Components/ModelLibraryDrawer';
import { useStore, observer } from 'store/utils';
import { useMount, useUnmount } from 'hooks';
import { getObserverTree } from 'mobx';
import { withRouter, RouteComponentProps } from 'react-router';
import { EType } from 'store/ModelLibrary/interface';

const ModelLibrary = (props: RouteComponentProps) => {
  const { ModelLibraryStore } = useStore();
  const { DrawerStore, ListStore } = ModelLibraryStore;

  function goToPage(id: string) {
    props.history.push(`/app/ModelLibrary/ModelCompared/${id}`);
  }
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (value: string, records: any, index: number) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: '客户姓名',
      dataIndex: 'customName',
      key: 'customName'
    },
    {
      title: '联系方式',
      dataIndex: 'customPhone',
      key: 'customPhone'
    },
    {
      title: '年龄',
      dataIndex: 'customAge',
      key: 'customAge'
    },
    {
      title: '术前/模型数',
      dataIndex: 'beforeCount',
      key: 'beforeCount'
    },
    {
      title: '术后/模型数',
      dataIndex: 'afterCount',
      key: 'afterCount'
    },
    {
      title: '最近上传',
      dataIndex: 'recentUploadDate',
      key: 'recentUploadDate'
    },
    {
      title: '操作',
      key: 'customId',
      dataIndex: 'customId',
      render: (id: string, records: any) => (
        <div className="operate csp flex ">
          <div
            className="mr-12"
            onClick={() =>
              ListStore.openDrawer(
                id,
                records.customName,
                records.customPhone,
                EType.THREEMODAL
              )
            }
          >
            详情
          </div>
          <div
            className="mr-12"
            onClick={() => {
              goToPage(id);
            }}
          >
            模型对比
          </div>
        </div>
      )
    }
  ];
  const onShowSizeChange = (current: number, defaultPageSize: number) => {
    ListStore.changePageInfo(current, defaultPageSize);
  };
  const onChange = (current: number, defaultPageSize: number) => {
    ListStore.changePages(current, defaultPageSize);
  };
  const pagination = {
    current: ListStore.index,
    defaultPageSize: ListStore.size,
    showSizeChanger: true,
    total: ListStore.total,
    pageSizeOptions: ['15', '30', '50', '100'],
    showTotal: () => `共 ${ListStore.total} 条`,
    onChange: onChange,
    onShowSizeChange: onShowSizeChange,
    showQuickJumper: true
  };
  useMount(() => {
    ListStore.customerManage();
  });
  useUnmount(() => {
    ListStore.resetStore();
  });
  const getUserInfo = (e: any) => {
    ListStore.changeUserInfo(e.target.value);
  };

  return (
    <div className="modelManage m-16 16 0 16">
      <div className="modelManage_header pl-24 flex_left">
        <div className="modelManage_header_userinfo tl fs-14 mr-10">
          客户姓名或电话
        </div>
        <Input
          className="modelManage_header_userinput fs-14"
          placeholder="请输入姓名或电话"
          onPressEnter={getUserInfo}
          onBlur={getUserInfo}
        />
      </div>
      <Table
        columns={columns}
        dataSource={ListStore.dataSource}
        className="modelTable"
        pagination={pagination}
        scroll={{ y: 'calc(100vh - 190px)' }}
        rowKey="customId"
      />
      <ModelLibraryDrawer />
    </div>
  );
};
export default withRouter(observer(ModelLibrary));
