/*
 * @Author: huxianyong
 * @Date: 2019-11-25 20:01:19
 * @Last Modified by: shiyao you
 * @Last Modified time: 2019-12-04 11:10:47
 */

import React, { SFC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './ModelLibraryDrawer.scss';
import QUIcon from 'components/QUIcon';
import DrawerStore from 'store/ModelLibrary/Components/DrawerStore';
import { Modal, Popover, Tooltip } from 'antd';
const { confirm } = Modal;
import { useStore, useObserver } from 'store/utils';
import { EType } from 'store/ModelLibrary/interface';
import { useRouter } from 'hooks';
interface IProps {
  path: string;
  children: ReactNode;
  id: string;
}

const LazyPhotoItem: SFC<IProps> = (props: IProps) => {
  const { path } = props;
  const images = [];
  const refs: any[] = [];
  const ref: any = React.createRef();
  const { ModelLibraryStore } = useStore();
  const { history } = useRouter();
  const { EditStore, DrawerStore } = ModelLibraryStore;
  /**
   * 根据type判断点击跳转类型
   */
  const handleEdit = (id: string) => {
    switch (DrawerStore.type) {
      case EType.THREEMODAL: {
        // 3D模型
        DrawerStore.photoDatas.forEach((item:any) => {
          item.child.forEach((x: any) => {
            x.children.forEach((y: any) => {
              y.modelId === id && EditStore.setFormData(y);
            });
          });
        });
        EditStore.setVisible(true);
        break;
      }
      case EType.COMPAREDMODAL: {
        // 已对比模型
        history.push(
          `/app/ModelLibrary/ModelCompared/${DrawerStore.customId}/${id}`
        );
        break;
      }
    }
  };
  refs.push(ref);
  const deleteModel = (id: string) => {
    confirm({
      title: '确定要删除吗',
      className: 'ngConfirmModal',
      centered: true,
      async onOk() {
        if (DrawerStore.type === EType.THREEMODAL) {
          return new Promise(async (resolve, reject) => {
            await DrawerStore.deleteThreeModel(id);
            resolve();
          });
        } else if (DrawerStore.type === EType.COMPAREDMODAL) {
          await DrawerStore.deleteCompareModel(id);
        }
      },
      onCancel() {}
    });
  };
  images.push(
    <div key={props.id}>
      <div className="photoItem_photosDateCut">
        <img
          onDoubleClick={() => {}}
          className="photoItem_photos"
          ref={ref}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            DrawerStore.type === EType.THREEMODAL &&
              history.push(
                `/app/ModelLibrary/ModelEdit?customId=${DrawerStore.customId}&modelId=${props.id}&isEdit=false`
              );
            DrawerStore.type === EType.COMPAREDMODAL &&
              history.push(
                `/app/ModelLibrary/ModelCompared/${DrawerStore.customId}/${
                  props.id
                }/${true}`
              );
          }}
        />
      </div>
      <div className="photoItem_button">{props.children}</div>

      <div className="photoItem_operation">
        <Tooltip
          title={
            DrawerStore.type === EType.THREEMODAL
              ? '编辑模型信息'
              : '编辑对比模型'
          }
          placement="right"
          arrowPointAtCenter
          overlayStyle={{ fontSize: 12 }}
        >
          <div
            className="csp photoItem_operation_icon  mb-8 "
            onClick={() => handleEdit(props.id)}
          >
            <QUIcon icon="iconbianji" fontSize={14} />
          </div>
        </Tooltip>
        {DrawerStore.type === EType.THREEMODAL && (
          <Tooltip
            title="编辑模型"
            placement="right"
            arrowPointAtCenter
            overlayStyle={{ fontSize: 12 }}
          >
            <div
              className="csp photoItem_operation_icon  mb-8 "
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                DrawerStore.type === EType.THREEMODAL &&
                  history.push(
                    `/app/ModelLibrary/ModelEdit?customId=${DrawerStore.customId}&modelId=${props.id}&isEdit=true`
                  );
              }}
            >
              <QUIcon icon="iconmoxing" fontSize={14} />
            </div>
          </Tooltip>
        )}
        <Tooltip
          title={
            DrawerStore.type === EType.THREEMODAL ? '删除模型' : '删除对比模型'
          }
          placement="right"
          arrowPointAtCenter
          overlayStyle={{ fontSize: 12 }}
        >
          <div
            className="csp photoItem_operation_icon"
            onClick={() => deleteModel(props.id)}
          >
            <QUIcon icon="iconshanchu1" fontSize={14} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
  const threshold = [0.01];
  // 利用 IntersectionObserver 监听元素是否出现在视口
  const io = new IntersectionObserver(
    entries => {
      // 观察者
      entries.forEach((item: any) => {
        // entries 是被监听的元素集合它是一个数组
        if (item.intersectionRatio <= 0) return; // intersectionRatio 是可见度 如果当前元素不可见就结束该函数。
        const { target } = item;
        target.src = path; // 将 h5 自定义属性赋值给 src (进入可见区则加载图片)
      });
    },
    {
      threshold // 添加触发时机数组
    }
  );

  // onload 函数
  const onload = () => {
    refs.forEach(item => {
      io.observe(item.current); // 添加需要被观察的元素。
    });
  };

  return (
    <div className="photoItem">
      {images}
      <img onError={onload} src="" style={{ display: 'none' }} />
    </div>
  );
};
export default LazyPhotoItem;
