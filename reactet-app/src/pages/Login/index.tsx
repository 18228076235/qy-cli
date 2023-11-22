/** @format */

import React, { useCallback, memo, useEffect } from 'react';
import { useStore, useObserver } from 'store/utils';
import { RouteComponentProps } from 'react-router';
import Particles from 'react-particles-js';
import QUApplicationControl from 'components/QUApplicationControl';
import UsernnameInput from './Components/UserInput';
import PasswordInput from './Components/UserInput';
import SubmitButton from './Components/SubmitButton';
import Remember from './Components/Remember';

import './index.scss';

interface ILoginProps extends RouteComponentProps {
  onSetLoginInfo: (data: any) => void;
  api_url: string;
}

const Login = (props: ILoginProps) => {
  const { LoginStore } = useStore();

  useEffect(() => {
    const rememberAccount = localStorage.getItem('account');
    if (rememberAccount) {
      LoginStore.changeInput('account', rememberAccount);
      LoginStore.changeRemember(true);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (LoginStore.isLoading) return;
    const { username, password } = LoginStore;
    if (username.length < 2) {
      LoginStore.changeError({
        type: 'account',
        message: '你输入的信息长度不够'
      });
      return;
    }
    if (password.length < 2) {
      LoginStore.changeError({
        type: 'password',
        message: '你输入的信息长度不够'
      });
      return;
    }
    LoginStore.changeLoading(true);

    await LoginStore.callLogin(() => {
      props.history.replace('/');
    });
  }, [
    LoginStore.username,
    LoginStore.password,
    LoginStore.isLoading,
    props.api_url
  ]);

  return useObserver(() => (
    <div className="login">
      <Particles
        className="login_particle"
        params={{
          particles: {
            number: {
              value: 100
            },
            size: {
              value: 1
            },
            color: {
              value: '#52c5ff'
            },
            line_linked: {
              color: '#52c5ff'
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: 'grab'
              }
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              }
            }
          }
        }}
      />
      <div className="login_box">
        <div className="login_container">
          <QUApplicationControl color="#668fe1" />
          <div className="login_container_leftbox">
            <UsernnameInput
              title="账号"
              type="account"
              errorInfo={LoginStore.errorInfo}
              onSubmit={handleSubmit}
              value={LoginStore.username}
            />
            <PasswordInput
              title="密码"
              type="password"
              errorInfo={LoginStore.errorInfo}
              onSubmit={handleSubmit}
              value={LoginStore.password}
            />
            <Remember />
            <SubmitButton
              onSubmit={handleSubmit}
              isLoading={LoginStore.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  ));
};

export default memo(Login);
