/*
 * @Author: shiyao you
 * @Date: 2019-11-26 11:28:15
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:49:56
 */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { useStore, observer } from 'store/utils';
import { IEditParams } from 'store/ModelLibrary/Components/EditStore';
import moment from 'moment';
import './index.scss';
const { Option } = Select;

interface IProps extends FormComponentProps {}

enum Eduration {
  Before = 1,
  After = 2
}

/**
 * 编辑页面
 * @param props
 */
function EditModal(props: IProps) {
  const bodyStyle: object = {
    background: '#F5F6FA',
    padding: '16px'
  };
  const {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields
  } = props.form;
  const onChange = () => {};
  const { ModelLibraryStore } = useStore();
  const { EditStore, DrawerStore } = ModelLibraryStore;
  const { projectId, updateDate, modelState, modelId } = EditStore.formData;
  const handleOk = async () => {
    const { updateDate, projectId, modelState } = getFieldsValue();
    const params: IEditParams = {
      projectId,
      state: modelState,
      uploadDate: updateDate.format('YYYY-MM-DD HH:mm:ss'),
      modelId: modelId
    };
    await EditStore.postThreeDInfo(params);
    DrawerStore.getDrawerInfo();
    EditStore.setVisible(false);
  };
  const handleCancel = () => {
    EditStore.setVisible(false);
    resetFields();
  };
  const children: JSX.Element[] = [];
  DrawerStore.projectOption.forEach((item: any) =>
    children.push(<Option key={item.id}>{item.name}</Option>)
  );
  const MySelect = () => {
    return (
      <Select
        className="modal_form_item_input"
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
      >
        {children}
      </Select>
    );
  };

  /**
   * 副作用处理函数
   */
  useEffect(() => {
    setFieldsValue({
      projectId,
      updateDate: moment(updateDate),
      modelState,
      customerName: DrawerStore.customerName
    });
  }, [EditStore.formData]);

  return (
    <Modal
      title="编辑模型信息"
      visible={EditStore.visible}
      className="modal"
      okText="保存"
      onOk={handleOk}
      onCancel={handleCancel}
      bodyStyle={bodyStyle}
    >
      <div className="p-26 modal_parent">
        <Form layout="inline" className="modal_form">
          <Form.Item className="modal_form_item" label="客户姓名">
            {getFieldDecorator('customerName', {
              initialValue: DrawerStore.customerName
            })(<Input className="modal_form_item_input" disabled />)}
          </Form.Item>

          <Form.Item className="modal_form_item" label="项目">
            {getFieldDecorator('projectId', {
              initialValue: projectId
            })(MySelect())}
          </Form.Item>
          <Form.Item className="modal_form_item mt-16" label="上传日期">
            {getFieldDecorator('updateDate', {
              initialValue: moment(updateDate)
            })(
              <DatePicker
                onChange={onChange}
                className="modal_form_item_input"
              />
            )}
          </Form.Item>
          {modelState != 3 ? (
            <Form.Item className="modal_form_item mt-16" label="模型类型">
              {getFieldDecorator('modelState', {
                initialValue: modelState
              })(
                <Radio.Group>
                  <Radio value={Eduration.Before}>术前</Radio>
                  <Radio value={Eduration.After}>术后</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          ) : (
            ''
          )}
        </Form>
      </div>
    </Modal>
  );
}
export default Form.create<IProps>()(observer(EditModal));
