import React from 'react';
import { Pagination } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';

interface IProps extends PaginationProps {
  search?: string;
  getCurrentPage: (current: number, pageSize: number) => void;
}
interface IState {
  search: string;
  current: number;
  pageSize: number;
  total: number;
}

const QUPagination = (props: IProps) => {
  const paginationSettings: IState = {
    search: '',
    current: 1,
    pageSize: 5,
    total: 0
  };
  const handleChange = (current: number, pageSize: number) => {
    props.getCurrentPage(current, pageSize);
  };
  return (
    <Pagination {...paginationSettings} onChange={handleChange}></Pagination>
  );
};

export default React.memo(QUPagination);
