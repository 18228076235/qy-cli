/**
 * /*
 *
 * @format
 * @Author: huangying
 * @Date: 2018-09-26 16:00:37
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-26 15:18:32
 */

import React, { SFC, ReactNode, memo } from 'react';
import './index.scss';
interface IProps {
  className?: string;
  text?: string | ReactNode;
  noDataSrc?: any;
  textClassName?: string;
  style?: object;
}

const QUNoData: SFC<IProps> = ({
  text = '暂时没有数据哦～',
  noDataSrc,
  className,
  textClassName,
  style
}) => {
  const noData = noDataSrc ? noDataSrc : require('assets/noData.png');
  return (
    <div
      style={style || {}}
      className={`flex_c flex_column quNoData ${className}`}
    >
      <img src={noData} className="noData_img" />
      <div className={`fs-16 noData_text mb-40 ${textClassName}`}>{text}</div>
    </div>
  );
};
export default memo(QUNoData);
