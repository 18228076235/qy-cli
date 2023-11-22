/** @format */

import React, { memo } from 'react';
interface IProps {
  isLoading: boolean;
  onSubmit: () => void;
}
const SubmitButton = (props: IProps) => {
  const { isLoading, onSubmit } = props;
  const handleSubmit = () => {
    if (isLoading) return;
    onSubmit();
  };
  return (
    <button
      className="login_container_submit mt-45 csp fs-16"
      onClick={handleSubmit}
    >
      {isLoading ? '登录中...' : '登录'}
    </button>
  );
};

export default memo(SubmitButton);
