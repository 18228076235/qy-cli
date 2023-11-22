import React, { PureComponent, useEffect } from 'react';
import { BaseModel } from '../BaseModel';
import { IProps } from '../BaseModel/interface';
import './index.scss';
import { withMobx } from 'store/utils';
import { IStore } from 'store';
interface ILinkageModelProps extends IProps {
  modelUrlRight: string;
  ModelComparedStore: IStore['ModelComparedStore'];
  modelLabelsRight: string;
  index: number;
}
class LinkageModel extends PureComponent<ILinkageModelProps> {
  leftBaseModel: BaseModel;
  rightBaseModel: BaseModel;
  changeFlag = false;
  private leftDom: HTMLElement;
  private rightDom: HTMLElement;
  componentDidMount() {
    this.leftDom = document.getElementById(
      this.props.id + '_box_left'
    ) as HTMLElement;
    this.leftDom.addEventListener('dragenter', e => {
      e.preventDefault();
    });
    this.leftDom.addEventListener('dragover', e => {
      e.preventDefault();
    });
    this.leftDom.addEventListener(
      'drop',
      (e: any) => {
        e.preventDefault();
        this.props.ModelComparedStore.leftDomDrop(this.props.index);
      },
      false
    );
    this.rightDom = document.getElementById(
      this.props.id + '_box_right'
    ) as HTMLElement;
    this.rightDom.addEventListener('dragenter', e => {
      e.preventDefault();
    });
    this.rightDom.addEventListener('dragover', e => {
      e.preventDefault();
    });
    this.rightDom.addEventListener(
      'drop',
      (e: any) => {
        e.preventDefault();
        this.props.ModelComparedStore.rightDomDrop(this.props.index);
      },
      false
    );
  }
  registerChangeEvent = () => {
    if (this.leftBaseModel.controller && this.rightBaseModel.controller) {
      this.leftBaseModel.controller.addEventListener('change', e => {
        this.changeFlag = true;
        if (!this.changeFlag) return;
        this.changeCamera(e, 'rightBaseModel');
      });
      this.rightBaseModel.controller.addEventListener('change', e => {
        this.changeFlag = true;
        if (!this.changeFlag) return;
        this.changeCamera(e, 'leftBaseModel');
      });
    }
  };
  changeCamera = (e: any, target: `rightBaseModel` | `leftBaseModel`) => {
    try {
      const { x, y, z } = e.target.object.position;
      (this[target].camera as THREE.PerspectiveCamera).position.set(x, y, z);
      const { _x, _y, _z } = e.target.object.rotation;
      (this[target].camera as THREE.PerspectiveCamera).rotation.set(_x, _y, _z);
    } catch (error) {}
  };
  onDrop(e: any) {
    e.preventDefault();
  }

  componentDidUpdate(prevProps: ILinkageModelProps) {
    if (
      this.props.modelLabels &&
      this.props.modelUrl &&
      prevProps.showLabels !== this.props.showLabels
    ) {
      this.leftBaseModel.changeDisplayLabels();
    }
    if (
      this.props.modelLabelsRight &&
      this.props.modelUrlRight &&
      prevProps.showLabels !== this.props.showLabels
    ) {
      this.rightBaseModel.changeDisplayLabels();
    }
  }
  componentWillUnmount() {
    if (this.leftDom) {
      this.leftDom.removeEventListener('dragenter', () => {});
      this.leftDom.removeEventListener('dragover', () => {});
      this.leftDom.removeEventListener('drop', () => {});
      this.rightDom.removeEventListener('dragenter', () => {});
      this.rightDom.removeEventListener('dragover', () => {});
      this.rightDom.removeEventListener('drop', () => {});
    }
  }
  render() {
    const { id } = this.props;
    return (
      <div className="linkage_model">
        <div className="linkage_model_left" id={id + '_box_left'}>
          <BaseModel
            {...this.props}
            modelUrl={this.props.modelUrl}
            id={id + '_left'}
            ref={(c: BaseModel) => (this.leftBaseModel = c)}
            registerChangeEvent={this.registerChangeEvent}
          />
          <div className="tag_lable flex_c">术前</div>
        </div>
        <div className="linkage_model_right" id={id + '_box_right'}>
          <BaseModel
            {...this.props}
            modelUrl={this.props.modelUrlRight}
            modelLabels={this.props.modelLabelsRight}
            id={id + '_right'}
            ref={(c: BaseModel) => (this.rightBaseModel = c)}
            registerChangeEvent={this.registerChangeEvent}
          />
          <div className="tag_lable flex_c">术后</div>
        </div>
      </div>
    );
  }
}

export default withMobx(LinkageModel, 'ModelComparedStore');
