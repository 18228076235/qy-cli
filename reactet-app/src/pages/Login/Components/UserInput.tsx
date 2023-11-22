/** @format */

import React, {
  KeyboardEvent,
  ChangeEvent,
  useMemo,
  memo,
  useState
} from 'react';
import { useStore, useObserver } from 'store/utils';
import QUIcon from 'components/QUIcon';
export interface IInput {
  type: string;
  title: string;
  placeholder?: string;
  errorInfo: {
    type: string;
    message: string;
  };
  value?: string;
  onSubmit: () => void;
}
// 只读 就设计成非受控组件
const InputWrapper = (props: IInput) => {
  const { LoginStore } = useStore();
  const [isFocus, setIsFocus] = useState(false);
  const { type, onSubmit, value, placeholder } = props;
  const { message } = LoginStore.errorInfo;
  const _type = LoginStore.errorInfo.type;
  const isError = _type === type;
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.keyCode === 13) {
      onSubmit();
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    LoginStore.changeInput(type, event.target.value);
  };
  const handleFocus = () => {
    setIsFocus(true);
  };
  const handleBlur = () => {
    setIsFocus(false);
  };

  const getIcon = useMemo(
    () =>
      type === 'account' ? (
        <QUIcon className="fs-16" icon="icon-zhanghaodenglu" />
      ) : (
        <QUIcon className="fs-16" icon="icon-mima" />
      ),
    [props.type]
  );

  return useObserver(() => (
    <div className="login_container_leftbox_userinput mb-5">
      <div
        className={`${
          isError
            ? 'mt-5 login_container_leftbox_userinput_inner error'
            : 'mt-5 login_container_leftbox_userinput_inner'
        } ${isFocus ? 'focus' : ''} flex_left`}
      >
        <div className="login_container_leftbox_userinput_inner_iconfont pt-9 pb-9">
          {getIcon}
        </div>
        <input
          type={
            type === 'account' || LoginStore.passwordView ? 'text' : 'password'
          }
          className="pl-10 pt-8 pb-8 fs-16 login_container_leftbox_userinput_inner_input"
          placeholder={placeholder}
          onKeyPress={handleKeyPress}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
        />
        {type === 'password' && (
          <QUIcon
            onClick={LoginStore.changePasswordView}
            className="login_container_leftbox_userinput_inner_eye csp fs-20"
            icon={LoginStore.passwordView ? 'icon-eye-close' : 'icon-chakan1'}
          />
        )}
      </div>
      <p
        className={
          isError
            ? 'fs-12 login_container_leftbox_tip active'
            : 'fs-12 login_container_leftbox_tip'
        }
      >
        {message}
      </p>
    </div>
  ));
};
export default memo(InputWrapper);
