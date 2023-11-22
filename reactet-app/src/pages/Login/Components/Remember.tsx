import React from 'react';
import { Checkbox } from 'antd';
import { useStore, observer } from 'store/utils';
const Remember = () => {
  const { LoginStore } = useStore();
  return (
    <div className="login_container_leftbox_userinput">
      <Checkbox
        className="mr-8 checkbox"
        checked={LoginStore.isRemember}
        onChange={e => LoginStore.changeRemember(e.target.checked)}
      />
      <span className="login_container_leftbox_userinput_tip">记住账号</span>
    </div>
  );
};

export default observer(Remember);
