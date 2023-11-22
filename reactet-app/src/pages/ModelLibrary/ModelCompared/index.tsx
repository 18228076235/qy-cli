/*
 * @Author: huxianyong
 * @Date: 2019-11-28 15:10:17
 * @Last Modified by: huxianyong
 * @Last Modified time: 2019-12-04 17:26:23
 */
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useMount, useUnmount } from 'hooks';
import { useStore, observer, toJS } from 'store/utils';
import './index.scss';
import QUIcon from 'components/QUIcon';
import { Button, message, Checkbox } from 'antd';
import { LinkageModel } from '../Components/LinkageModel';
import PhotoDrawer from './Components/PhotoDrawer/PhotoDrawer';
import { debounce } from 'lodash-es';
import SaveModal from './Components/SaveModal';
import { withRouter } from 'react-router';
import { FullScreen } from 'utils/Tools';
import moment from 'moment';
interface IProps
  extends RouteComponentProps<{
    customId: string;
    comparedId?: string;
    isDetail?: string;
  }> {}
const ModelCompared = (props: IProps) => {
  const { ModelComparedStore } = useStore();
  const [style, setStyle] = useState({
    height: window.innerHeight - (!props.match.params.isDetail ? 110 : 70),
    width: window.innerWidth / 2 - 40 // 30二分之一的裁剪值
  });
  const resize = debounce(() => {
    setStyle({
      height: window.innerHeight - (!props.match.params.isDetail ? 110 : 70),
      width: window.innerWidth / 2 - 40
    });
  }, 16.7);
  useMount(() => {
    if (props.match.params.comparedId) {
      ModelComparedStore.getComparedInfo(props.match.params.comparedId);
    }
    if (!props.match.params.comparedId) {
      addComparedData();
    }
    resize();
    ModelComparedStore.getEditorOption(props.match.params.customId);
    ModelComparedStore.setId(props.match.params.customId);
    window.addEventListener('resize', resize);
    const imgBox = document.getElementById('photo_list_box') as HTMLElement;
    const compareBox = document.getElementById(
      `compare_photo_box`
    ) as HTMLElement;
    imgBox.addEventListener('dragstart', imgBoxDragstart, false);
    imgBox.addEventListener('drag', imgBoxDrag, false);
    imgBox.addEventListener('dragend', imgBoxDragend, false);
    compareBox.addEventListener('dragstart', compareBoxDragstart, false);
    compareBox.addEventListener('drag', compareBoxDrag, false);
    compareBox.addEventListener('dragend', compareBoxDragend, false);
  });
  function addComparedData() {
    if (ModelComparedStore.comparedDatas.length === 3) {
      message.warning('最多添加三组对比模型');
      return;
    }
    ModelComparedStore.setComparedData({
      modelUrl: '',
      modelUrlRight: ''
    });
  }
  function imgBoxDragstart(e: DragEvent) {
    // @ts-ignore
    const data = e.target && e.target.dataset;
    ModelComparedStore.photoDragStart(data);
  }
  function imgBoxDrag(e: DragEvent) {
    e.preventDefault();
  }
  function imgBoxDragend(e: DragEvent) {
    e.preventDefault();
    ModelComparedStore.photoDragEnd();
  }

  function compareBoxDragstart(e: DragEvent) {
    if (e.target) {
      // @ts-ignore
      const dataset: { models: any } = e.target.dataset;
      if (dataset.models) {
        const models = JSON.parse(dataset.models);

        ModelComparedStore.setComparedDragData(models, true);
      }
    }
  }

  function compareBoxDrag(e: DragEvent) {
    e.preventDefault();
  }
  function compareBoxDragend(e: DragEvent) {
    e.preventDefault();
    ModelComparedStore.comparedDragEnd();
  }
  useUnmount(() => {
    ModelComparedStore.resetStore();
    window.removeEventListener('resize', resize);
    const imgBox = document.getElementById('photo_list_box') as HTMLElement;
    const compareBox = document.getElementById(
      `compare_photo_box`
    ) as HTMLElement;
    imgBox.removeEventListener('dragstart', imgBoxDragstart);
    imgBox.removeEventListener('drag', imgBoxDrag);
    imgBox.removeEventListener('dragend', imgBoxDragend);

    compareBox.removeEventListener('dragstart', compareBoxDragstart);
    compareBox.removeEventListener('drag', compareBoxDrag);
    compareBox.removeEventListener('dragend', compareBoxDragend);
  });
  function goBack() {
    props.history.goBack();
  }
  return (
    <div className="modelCompared">
      <div className="modelCompared_header">
        <div className="flex_sb editModal">
          <div className="csp">
            {!props.match.params.isDetail ? (
              <Button type="primary" onClick={ModelComparedStore.changeVisible}>
                保存
              </Button>
            ) : (
              <span className="modelCompared_header_title">
                {ModelComparedStore.editInfo.modifyDate
                  ? moment(ModelComparedStore.editInfo.modifyDate).format(
                      'YYYY-MM-DD'
                    ) + ' '
                  : ''}
                {ModelComparedStore.editInfo.title}
              </span>
            )}
            <Button className="ml-16" onClick={() => FullScreen(document.body)}>
              全屏显示
            </Button>
            <Checkbox
              onChange={ModelComparedStore.featurePointsShow}
              className="ml-16"
              checked={ModelComparedStore.showFeaturePoints}
            >
              <span className="secondaryTextColor">显示标注点</span>
            </Checkbox>
          </div>
          <div className="csp" onClick={goBack}>
            <QUIcon icon="icontuichu" fontSize={14} color="#727B8D" />
            <span className="pl-4">退出</span>
          </div>
        </div>
      </div>
      <div
        className={`modelCompared_content ${
          !props.match.params.isDetail ? '' : 'modelCompared_detail'
        }`}
      >
        {ModelComparedStore.comparedDatas.map((item: any, index: number) => (
          <LinkageModel
            height={style.height}
            width={style.width}
            modelUrl={item.modelUrl}
            modelLabels={item.labels}
            showLabels={ModelComparedStore.showFeaturePoints}
            modelLabelsRight={item.labelsRight}
            modelUrlRight={item.modelUrlRight}
            index={index}
            id={item.id}
            key={item.id}
          />
        ))}
      </div>
      {!props.match.params.isDetail && (
        <div className="modelCompared_bottom flex_c">
          <Button
            className="add_btn"
            onClick={addComparedData}
            style={{ width: '100%' }}
          >
            <span className="addIcon">+</span>
          </Button>
        </div>
      )}
      {!ModelComparedStore.drawerVisible && !props.match.params.isDetail && (
        <div
          className="modelCompared_right csp"
          onClick={ModelComparedStore.changeDrawerVisible}
        >
          <div className="modelCompared_right_open ">
            <QUIcon icon="iconcollapse-copy" fontSize={16} color="#fff" />
          </div>
          <div className="modelCompared_right_text mainColor">选择模型</div>
        </div>
      )}
      <PhotoDrawer />
      <SaveModal />
    </div>
  );
};
export default withRouter(observer(ModelCompared));
