/*
 * @Author: shiyao you
 * @Date: 2019-11-25 17:35:59
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:41:40
 */

import React, { useState } from 'react';
import { Table, Button, Input, Modal } from 'antd';
import AccountModal from './Components/Modal';
import EditPwdModal from 'components/QUPasswordModal';
import useMount from 'hooks/useMount';
import { useStore, useObserver } from 'store/utils';
import './index.scss';
const { confirm } = Modal;
/**
 * 账户管理页面
 */
export default function Account() {
  const [visible, setVisible] = useState(false);
  const { AccountStore } = useStore();
  const [isAdd, setIsAdd] = useState(true);
  const [search, setSearch] = useState('');
  let [formData, setFormData] = useState({});
  const [visiblePwd, setVisiblePwd] = useState(false);
  const [formDataPwd, setFormDataPwd] = useState({});
  /**
   * 显示modal
   */
  const showModal = (row?: any) => {
    if (row) {
      setFormData({ ...row });
    }
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleOk = () => {
    handleClose();
  };
  const handleChange = (row: any) => {
    setIsAdd(false);
    showModal(row);
  };

  const showAddModal = () => {
    setIsAdd(true);
    showModal();
  };

  const handleClosePwd = () => {
    setVisiblePwd(false);
  };

  /**
   * 页码变化
   * @param current 当前页
   * @param pageSize 每页显示的条数
   */
  const changePageSize = (current: number, pageSize: number) => {
    AccountStore.setPage(current, pageSize);
    AccountStore.getAllUsers(current, pageSize, AccountStore.search);
  };

  const onShowSizeChange = (current: number, pageSize: number) => {
    AccountStore.setPage(current, pageSize);
    AccountStore.getAllUsers(current, pageSize, AccountStore.search);
  };
  const showPwdModal = (row: any) => {
    // console.log(row)
    setVisiblePwd(true);
    setFormDataPwd({ ...row });
  };

  const showDeleteModal = (id: any) => {
    confirm({
      className: 'ngConfirmModal',
      title: '确认删除项目吗?',
      cancelText: '取消',
      okText: '确定',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          await AccountStore.deleteUser(id);
          resolve();
        });
      },
      onCancel() {}
    });
  };

  // 定义列
  const columns: any = [
    {
      title: '序号',
      width: 40,
      dataIndex: 'index',
      key: 'index',
      className: 'account_first_columns_border',
      render: (text: string, record: any, index: number) => `${++index}`
    },
    {
      title: '姓名',
      width: 100,
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '工号',
      width: 100,
      dataIndex: 'userNo',
      key: 'userNo'
    },
    {
      title: '性别',
      width: 100,
      dataIndex: 'mySex',
      key: 'mySex'
    },
    {
      title: '创造日期',
      width: 100,
      dataIndex: 'myCreateDate',
      key: 'myCreateDate'
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      className: 'account_last_columns_border',
      render: (text: any, record: any, index: any) => (
        <div className="operation">
          <Button
            type="link"
            className="pr-12 account_button"
            onClick={() => handleChange(record)}
          >
            修改
          </Button>
          <Button
            type="link"
            className="pr-12 account_button"
            onClick={() => showDeleteModal(record.id)}
          >
            删除
          </Button>
          <Button
            type="link"
            className="account_button"
            onClick={() => showPwdModal(record)}
          >
            修改密码
          </Button>
        </div>
      )
    }
  ];

  const rowClass: any = (record: any, index: any): any => {
    return index % 2 === 0 ? 'account_table_double' : 'account_table_single';
  };
  const pagination = {
    // 默认当前页，每页显示数量，总数
    current: AccountStore.index,
    pageSize: AccountStore.size,
    total: AccountStore.total,
    showSizeChanger: true, //可改变每页数量
    showQuickJumper: true,
    pageSizeOptions: ['15', '30', '50', '100'],
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: changePageSize,
    onShowSizeChange: onShowSizeChange
  };

  const handleSearch = async () => {
    // console.log(search);
    AccountStore.setInfo(search);
    await AccountStore.getAllUsers(
      AccountStore.index,
      AccountStore.size,
      AccountStore.search
    );
  };
  /**
   * 初始化
   */
  useMount(() => {
    AccountStore.getAllUsers(
      AccountStore.index,
      AccountStore.size,
      AccountStore.search
    );

    // console.log(AccountStore.data);
  });
  return useObserver(() => (
    <div className="account m-16">
      <AccountModal
        visible={visible}
        handleClose={handleClose}
        handleOk={handleOk}
        isAdd={isAdd}
        formData={formData}
      />
      <EditPwdModal
        visible={visiblePwd}
        handleClose={handleClosePwd}
        formData={formDataPwd}
      />
      <div className="flex_sb account_tool">
        <div className="account_input ml-24">
          <span className="mr-8 account_input_title">姓名/电话/工号</span>
          <Input
            className="account_input_inner"
            onPressEnter={handleSearch}
            onChange={({ target }) => setSearch(target.value)}
            value={search}
          ></Input>
        </div>
        <Button
          type="primary"
          className="mt-16 mb-12 mr-24 account_button"
          onClick={showAddModal}
        >
          新建账户
        </Button>
      </div>
      <Table
        loading={AccountStore.loading}
        dataSource={AccountStore.data}
        columns={columns}
        rowKey="id"
        scroll={{ y: 'calc(100vh - 190px)' }}
        rowClassName={rowClass}
        pagination={pagination}
      ></Table>
    </div>
  ));
}
