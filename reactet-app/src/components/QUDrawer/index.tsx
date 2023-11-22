import React, { memo, Children, ReactNode, useState } from 'react';
import { Drawer } from 'antd';
import './index.scss';
import QUIcon from 'components/QUIcon';
interface IProps {
  children?: ReactNode; // 抽屉包裹的子节点，只能有一个根子节点
  visible: boolean; // 控制抽屉是否显示
  afterVisibleChange?: (visible: boolean) => void; // 抽屉动画完成后的回掉函数 visble 表示动画完成后抽屉的状态
  closeDrawer: () => void; // 关闭抽屉的方法
}
const QUDrawer = (props: IProps) => {
  const [closeBtnShow, setCloseBtnShow] = useState<boolean>(false);
  function afterVisibleChange(visible: boolean) {
    setCloseBtnShow(visible);
    props.afterVisibleChange && props.afterVisibleChange(visible);
  }
  return (
    <Drawer
      className="custom_drawer"
      visible={props.visible}
      closable={false}
      afterVisibleChange={afterVisibleChange}
    >
      {props.children && Children.only(props.children)}
      <div
        className={`left_close_icon  ${closeBtnShow ? '' : 'dsp_n'}`}
        onClick={props.closeDrawer}
      >
        <div className="left_close_icon_top" />
        <div className="left_close_icon_center flex_c">
          <QUIcon icon="iconguanbi" className="" fontSize={14} />
        </div>
        <div className="left_close_icon_bottom" />
      </div>
    </Drawer>
  );
};
export default memo(QUDrawer);
