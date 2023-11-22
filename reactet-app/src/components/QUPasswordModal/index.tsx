/*
 * @Author: shiyao you
 * @Date: 2019-11-26 11:28:15
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-11-27 21:12:55
 */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import AccountStore from 'store/Account';
import './index.scss';

interface IProps extends FormComponentProps {
  visible: boolean;
  formData?: any;
  handleClose: () => void;
}

interface IEditPwdParams {
  newPassword: string;
  originPassword: string;
  userName: string;
}
const bodyStyle: object = {
  background: '#F5F6FA',
  padding: '16px'
};
/**
 * 修改密码页面
 * @param props
 */
function EditPwdModal(props: IProps) {
  const [userName, setUserName] = useState('');
  const { getFieldDecorator, resetFields, getFieldsValue } = props.form;

  /**
   * 确定提交修改密码
   */
  const handleOk = () => {
    props.form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      const { newPassword, originPassword } = getFieldsValue();
      const formData: IEditPwdParams = {
        newPassword,
        originPassword,
        userName
      };
      await AccountStore.editPwd(formData);
      props.handleClose();
    });
  };

  const handleClose = () => {
    props.handleClose();
    resetFields();
  };

  /**
   * 副作用处理函数
   */
  useEffect(() => {
    const { username } = props.formData;
    // 设置修改的用户Id
    setUserName(username);
  }, [props.formData]);

  return (
    <Modal
      title="修改密码"
      visible={props.visible}
      className="modal"
      okText="保存"
      onOk={handleOk}
      onCancel={handleClose}
      bodyStyle={bodyStyle}
    >
      <div className="p-26 modal_parent">
        <Form layout="inline" className="modal_form">
          <Form.Item className="modal_form_item" label="原始密码">
            {getFieldDecorator('originPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入密码'
                }
              ]
            })(<Input.Password className="modal_form_item_input" />)}
          </Form.Item>
          <Form.Item className="modal_form_item" label="新密码">
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码'
                }
              ]
            })(<Input.Password className="modal_form_item_input" />)}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
export default React.memo(Form.create<IProps>()(EditPwdModal));
