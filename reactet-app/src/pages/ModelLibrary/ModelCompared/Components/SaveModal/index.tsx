/*
 * @Author: huxianyong
 * @Date: 2019-12-03 11:46:10
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-12-05 21:04:14
 */
import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { observer, useStore } from 'store/utils';
import './index.scss';
import { Qiniu } from 'utils/Qiniu';
import { CompletedResult } from 'qiniu-js';
import { IMODApiData } from 'server/Login';
interface IProps extends FormComponentProps {
  // visible: boolean;
}
const SaveModel = (props: IProps) => {
  const { getFieldDecorator, validateFieldsAndScroll } = props.form;
  const { ModelComparedStore } = useStore();

  useEffect(() => {
    if (
      ModelComparedStore.saveModalVisible &&
      ModelComparedStore.compareModelId
    ) {
      const data = {
        title: ModelComparedStore.editInfo.title,
        modifyDate: moment(ModelComparedStore.editInfo.modifyDate)
      };
      ModelComparedStore.seaveTitleChange(
        '',
        ModelComparedStore.editInfo.title
      );
      props.form && props.form.setFieldsValue(data);
    }
  }, [ModelComparedStore.saveModalVisible]);
  const dataURLtoFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(','),
      // @ts-ignore
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  // 保存对一张个对比模型截图
  const saveFirstPhoto = () => {};
  const onOk = () => {
    const { comparedDatas } = ModelComparedStore;

    validateFieldsAndScroll((error, formData) => {
      if (error) {
        return;
      }
      ModelComparedStore.setConfirmLoading();
      let modelsList: any = [];
      for (let i = 0; i < comparedDatas.length; i++) {
        if (!!!comparedDatas[i].modelId || !!!comparedDatas[i].modelIdRight) {
          message.error('请选择术前或术后模型');
          return;
        }
        let data: any = [
          {
            modelId: comparedDatas[i].modelId,
            modelState: comparedDatas[i].modelState
          },
          {
            modelId: comparedDatas[i].modelIdRight,
            modelState: comparedDatas[i].modelStateRight
          }
        ];
        modelsList.push(data);
      }
      formData.modifyDate = moment(formData.modifyDate).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      ModelComparedStore.getUploadToken(
        ModelComparedStore.compareModelId
          ? ModelComparedStore.editInfo.keyUid
          : ''
      )
        .then((res: IMODApiData) => {
          //生成截图
          const uploadKey = ModelComparedStore.compareModelId
            ? ModelComparedStore.editInfo.keyUid
            : res.data.key;
          let cvs: any = document.createElement('canvas');
          cvs.height = window.innerHeight;
          cvs.width = window.innerWidth;
          const ctx = cvs.getContext('2d');
          const v1 = document.getElementById('model0_left');
          const v2 = document.getElementById('model0_right');

          ctx?.drawImage(v1, 0, 0);
          ctx?.drawImage(v2, window.innerWidth / 2, 0);
          cvs.toBlob((r: any) => {
            if (r) {
              new Qiniu().upload(r, uploadKey, res.data.uploadToken).subscribe({
                next(res) {
                  // 这里是进度
                },
                error(err) {
                  message.error('上传对比模型截图失败');
                  ModelComparedStore.setConfirmLoading();
                },
                complete(respond: CompletedResult) {
                  ModelComparedStore.saveComparedModel(
                    Object.assign(formData, {
                      modelsList,
                      path: respond.key,
                      keyUid: uploadKey
                    })
                  );
                }
              });
            }
          });
        })
        .catch(() => {
          ModelComparedStore.setConfirmLoading();
        });
    });
  };
  function cancel() {
    props.form.resetFields();
    ModelComparedStore.changeVisible();
  }
  const NumberLimit = (
    <div>
      <span className="mainColor">{ModelComparedStore.numberLimit.length}</span>{' '}
      <span className="secondaryTextColor">/20</span>{' '}
    </div>
  );
  return (
    <Modal
      visible={ModelComparedStore.saveModalVisible}
      onCancel={cancel}
      title="保存模型对比"
      className="ngModal"
      confirmLoading={ModelComparedStore.confirmLoading}
      onOk={onOk}
    >
      <div className="saveModal">
        <Form layout="inline" className="modal_form">
          <Form.Item className="modal_form_item" label="">
            {getFieldDecorator('modifyDate', {
              rules: [
                {
                  required: true,
                  message: '请选择上传日期'
                }
              ],
              initialValue: moment()
            })(
              <DatePicker style={{ width: 130 }} placeholder="请选择上传日期" />
            )}
          </Form.Item>
          <Form.Item className="modal_form_item" label="">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入对比模型标题'
                }
              ]
            })(
              <Input
                maxLength={20}
                autoComplete="off"
                placeholder="请输入模型对比标题"
                style={{ width: 260 }}
                className="title_input"
                onChange={ModelComparedStore.seaveTitleChange}
                addonAfter={NumberLimit}
              />
            )}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
export default Form.create<IProps>()(observer(SaveModel));
