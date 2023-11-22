/*
 * @Author: shiyao you
 * @Date: 2019-11-26 11:28:15
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-02 16:22:27
 */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import AccountStore from 'store/Account';
import './index.scss';

interface IProps extends FormComponentProps {
  isAdd: boolean;
  visible: boolean;
  formData?: any;
  handleOk: () => void;
  handleClose: () => void;
}

interface ISaveParams {
  username: string;
  name: string;
  userNo: string;
  password: string;
  phone: string;
  sex: number;
}

interface IEditParams {
  username: string;
  name: string;
  userNo: string;
  phone: string;
  sex: number;
  userId: string;
}

// 定义性别
enum ESex {
  female = 0,
  male = 1
}

/**
 * 新增/修改页面
 * @param props
 */
function AccountModal(props: IProps) {
  const [userId, setUserId] = useState('');
  const bodyStyle: object = {
    background: '#F5F6FA',
    padding: '16px'
  };
  const {
    getFieldDecorator,
    resetFields,
    getFieldsValue,
    setFieldsValue
  } = props.form;

  const doSave = async (formData: any) => {
    const {
      password,
      confirmPwd,
      username,
      sex,
      userNo,
      phone,
      name
    } = formData;
    // 验证密码一致
    if (password !== confirmPwd) {
      message.error('两次密码不一致');
      return;
    }
    const params: ISaveParams = {
      username,
      sex,
      userNo,
      phone,
      password,
      name
    };
    await AccountStore.saveUser(params);
  };

  const doEdit = async (formData: any) => {
    const { username, sex, userNo, phone, name } = formData;
    const params: IEditParams = {
      username,
      sex,
      userNo,
      phone,
      name,
      userId
    };
    // console.log(params)
    await AccountStore.editUser(params);
  };

  /**
   * 确定提交
   */
  const handleOk = async () => {
    props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const formData = getFieldsValue();
      if (props.isAdd) {
        doSave(formData);
      } else {
        doEdit(formData);
      }
      props.handleOk();
      resetFields();
    });
  };
  const handleCancel = () => {
    props.handleClose();
    resetFields();
  };

  /**
   * 副作用处理函数
   */
  useEffect(() => {
    const { name, username, sex, userNo, phone, id } = props.formData;
    // 设置修改的用户Id
    setUserId(id);
    // 初始化修改内容
    setFieldsValue({
      name,
      username,
      sex,
      userNo,
      phone
    });
  }, [props.formData]);

  return (
    <Modal
      title={props.isAdd ? '新增账号' : '修改账号'}
      visible={props.visible}
      className="modal"
      okText="保存"
      onOk={handleOk}
      onCancel={handleCancel}
      bodyStyle={bodyStyle}
    >
      <div className="p-26 modal_parent">
        <Form layout="inline" className="modal_form">
          <Form.Item className="modal_form_item" label="姓名">
            {getFieldDecorator('name', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '请输入姓名'
                }
              ]
            })(<Input className="modal_form_item_input" />)}
          </Form.Item>

          <Form.Item className="modal_form_item" label="登录名">
            {getFieldDecorator('username', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '请输入登录名'
                },
                {
                  min: 2,
                  message: '长度必须大于2个字符'
                }
              ]
            })(<Input className="modal_form_item_input" />)}
          </Form.Item>
          <Form.Item className="modal_form_item mt-16" label="电话">
            {getFieldDecorator('phone', {
              validateTrigger: 'onBlur',
              rules: [{ required: true, message: '请输入电话' }]
            })(<Input className="modal_form_item_input" />)}
          </Form.Item>
          <Form.Item className="modal_form_item mt-16" label="性别">
            {getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: '请输入性别'
                }
              ]
            })(
              <Radio.Group>
                <Radio value={ESex.male}>男</Radio>
                <Radio value={ESex.female}>女</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {props.isAdd ? (
            <div>
              <Form.Item className="modal_form_item mt-16" label="密码">
                {getFieldDecorator('password', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请输入密码'
                    }
                  ]
                })(<Input.Password className="modal_form_item_input" />)}
              </Form.Item>
              <Form.Item className="modal_form_item mt-16" label="确认密码">
                {getFieldDecorator('confirmPwd', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      required: true,
                      message: '请再次输入密码'
                    }
                  ]
                })(<Input.Password className="modal_form_item_input" />)}
              </Form.Item>
            </div>
          ) : (
            ''
          )}

          <Form.Item className="modal_form_item mt-16" label="工号">
            {getFieldDecorator('userNo', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '请输入工号'
                }
              ]
            })(<Input className="modal_form_item_input" />)}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
export default Form.create<IProps>()(AccountModal);
