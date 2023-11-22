import React, { FC, useState } from 'react';
import { Popover } from 'antd';
import QRCode from 'qrcode.react';
// LoginStore.loginInfo.userInfo.name
import { useStore, useObserver } from 'store/utils';
import AppAssistant from 'utils/AppAssistant';
import PasswordModal from 'components/QUPasswordModal';
import { AesEncrypt_qrcode } from 'utils/Tools';
const UserInfo: FC = () => {
  const { LoginStore } = useStore();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const showPasswordModal = () => {
    setVisible(true);
    setFormData({
      username: LoginStore.username
    });
  };
  const handleClose = () => {
    setVisible(false);
  };
  const Content = (
    <div>
      <PasswordModal
        visible={visible}
        formData={formData}
        handleClose={handleClose}
      />
      <div className="userInfo_popover" onClick={showPasswordModal}>
        修改密码
      </div>
      <div
        className="userInfo_popover myCode"
        onMouseEnter={LoginStore.updateQRdate}
      >
        我的二维码
        <div className="qrcodeContent">
          <QRCode
            value={AesEncrypt_qrcode(JSON.stringify(LoginStore.qrCodeStr))}
          />
        </div>
      </div>
      <div
        className="userInfo_popover"
        onClick={AppAssistant.getInstance().logout}
      >
        注销
      </div>
    </div>
  );
  return useObserver(() => (
    <Popover content={Content} title={null} placement="right">
      <div className="userInfo flex_c">
        <div className="userInfo_box ">
          <div>
            <img
              src={require('../../../static/UserInfo/defaultAvatar.png')}
              alt="用户头像"
              className="userInfo_box_avatar"
            />
            <span className="wes username">
              {LoginStore.loginInfo.userInfo.name}
            </span>
          </div>
        </div>
      </div>
    </Popover>
  ));
};

export default UserInfo;
