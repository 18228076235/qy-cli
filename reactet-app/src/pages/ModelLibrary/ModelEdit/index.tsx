import React, { Component } from 'react';

import Header from './Header';
import Model from './Model';
import './index.scss';
import { withRouter, RouteComponentProps } from 'react-router';
import { searchToObj, IsFullScreen, exitFullScreen } from 'utils/Tools';
import { ModelLibraryServer } from 'server';
import { message } from 'antd';

const initState = {
  showLabels: true,
  showLandmark: true,
  isEdit: false,
  buttonLoading: false,
  modelInfo: {
    modelId: '',
    customId: '',
    labels: '',
    landmark: '',
    path: ''
  }
};
type TState = Readonly<typeof initState>;
class Edit extends Component<RouteComponentProps, TState> {
  state: TState = initState;
  model: Model;
  componentDidMount() {
    const { customId, modelId, isEdit } = searchToObj(
      this.props.location.search
    );
    ModelLibraryServer.getModelInfo({
      customId,
      modelId
    })
      .then(res => {
        if (res.code === 10001) {
          this.setState({
            modelInfo: res.data,
            isEdit: isEdit === 'false' ? false : true
          });
        }
      })
      .catch(_ => {
        message.error('获取模型信息失败,请重试');
      });
  }
  changeShowLandmark = (e: boolean) => {
    this.setState(
      {
        showLandmark: e
      },
      () => {
        this.model.changeDisplayLandmark();
      }
    );
  };
  changeShowLabels = (e: boolean) => {
    this.setState(
      {
        showLabels: e
      },
      () => {
        this.model.changeDisplayLabels();
      }
    );
  };
  save = async () => {
    try {
      if (this.state.isEdit) {
        this.setState({
          buttonLoading: true
        });
        const labels = this.model.getLabels();
        const data = { labels, modelId: this.state.modelInfo.modelId };
        const res = await ModelLibraryServer.updateModel(data);
        if (res.code === 10000) {
          message.success('保存成功!');
        } else {
          message.error('保存失败,请联系管理员');
        }
      }
    } catch (error) {
      message.error('保存失败,请联系管理员');
    } finally {
      this.setState({
        buttonLoading: false
      });
    }
  };
  exit = () => {
    IsFullScreen(document.body)
      .then(() => {
        exitFullScreen();
      })
      .finally(() => {
        this.props.history.goBack();
      });
  };
  render() {
    const { path, labels, landmark } = this.state.modelInfo;
    const { showLabels, showLandmark, isEdit, buttonLoading } = this.state;

    return (
      <div className="model_edit">
        <Header
          save={this.save}
          showLabels={showLabels}
          showLandmark={showLandmark}
          changeShowLabels={this.changeShowLabels}
          changeShowLandmark={this.changeShowLandmark}
          isEdit={isEdit}
          exit={this.exit}
          buttonLoading={buttonLoading}
        />
        <div className="model_edit_box">
          <Model
            id={'canvas'}
            modelUrl={path}
            modelLabels={labels}
            modelLandmark={landmark}
            showLabels={showLabels}
            showLandmark={showLandmark}
            isEdit={isEdit}
            ref={(c: Model) => (this.model = c)}
          />
        </div>
      </div>
    );
  }
}
export default withRouter(Edit);
