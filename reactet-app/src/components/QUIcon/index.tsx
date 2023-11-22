/*
 * @Author: huangying
 * @Date: 2019-08-26 15:14:40
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-26 15:16:51
 */
import React, { memo, MouseEvent } from 'react';
interface IProps {
  className?: string;
  color?: string;
  fontSize?: number;
  icon: string;
  onClick?: (event: MouseEvent) => void;
}
const QUIcon = (props: IProps) => {
  const { color, fontSize = 14, icon, className, onClick } = props;
  return (
    <svg
      onClick={onClick}
      color={color}
      fontSize={fontSize}
      className={`icon ${className}`}
      aria-hidden="true"
    >
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
};
export default memo(QUIcon);
