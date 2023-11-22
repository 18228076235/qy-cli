/*
 * @Author: huangying
 * @Date: 2019-08-23 15:12:05
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-11-26 17:09:18
 */
import React, { ReactNode, MouseEvent, memo, useState } from 'react';
import { useStore } from 'store/utils';
import QUIcon from 'components/QUIcon';
interface IProps {
  isPhone?: boolean;
  className?: string;
  defaultShow: ReactNode;
  privacyShow?: ReactNode;
  onChangeShowState?: (show: boolean) => void;
  unit?: string;
}
const QUPrivacyInfo = (props: IProps) => {
  const {
    isPhone = false,
    defaultShow = '-',
    privacyShow = '******',
    unit = '',
    className
  } = props;
  const { LoginStore } = useStore();
  let customerDetail_phoneNumber = 1;
  const [show, setShow] = useState<boolean>(false);
  function onChange(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    const newShow = !show;
    setShow(newShow);
    props.onChangeShowState && props.onChangeShowState(newShow);
  }
  const privacy =
    isPhone && typeof defaultShow === 'string'
      ? defaultShow.replace(/(\d{3})\d{4}/, '$1****')
      : privacyShow;
  const info = show ? defaultShow || '-' : defaultShow ? privacy : '-';
  const showIcon =
    isPhone && customerDetail_phoneNumber === 0 ? false : info !== '-';
  return (
    <div className={className}>
      {unit}
      {info}
      {showIcon && (
        <QUIcon
          onClick={onChange}
          icon={show ? 'icon-eye-close' : 'icon-chakan1'}
          className={`fs-12 ml-8 overdueColor csp `}
        />
      )}
    </div>
  );
};
export default memo(QUPrivacyInfo);
