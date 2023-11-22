import React, { Component } from 'react';
import * as THREE from 'three';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import { Spin, message } from 'antd';
import './BaseModel.scss';
import { LabelUtils } from './LabelUtils';
import { cameraOpts, controllerOpts } from './constants';
import { IProps } from './interface';
import globalConfig from 'global/globalConfig';

const initState = {
  loading: true
};
type TState = Readonly<typeof initState>;
class BaseModel extends Component<IProps, TState> {
  state: TState = initState;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  aspectRatio: number;
  labelRenderer: CSS2DRenderer;
  controller: OrbitControls | null;
  cameraTarget = new THREE.Vector3(0, 0, 0);
  activeAnimationFrame: number;
  labelUtils: LabelUtils;
  labelGroup: THREE.Group;
  activeObj: any;
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id) as HTMLCanvasElement;
    this.initTHREE();
    this.initLabelRenderer();
    this.resizeDisplayGL();
    this.props.modelUrl && this.loadModel();
    if (!this.props.modelUrl) {
      this.setState({
        loading: false
      });
    }
    this.animate();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.activeAnimationFrame);
    this.scene?.dispose();
    this.scene = null;
    this.camera = null;
    this.controller = null;
    this.empty(this.canvas);
  }
  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
      this.resizeDisplayGL();
    }
    if (this.props.modelUrl !== prevProps.modelUrl) {
      this.loadModel();
    }
  }
  private renderLabels = () => {
    try {
      //TODO:必传 修改interface
      //@ts-ignore
      const res = JSON.parse(this.props.modelLabels);
      this.labelUtils.renderLabel(res);
    } catch (error) {
      message.error('渲染标注点失败');
    }
  };
  public changeDisplayLabels = () => {
    const hasRender = this.labelGroup.children.length > 0;
    if (this.props.showLabels) {
      if (hasRender) {
        this.labelGroup.children.forEach(item => {
          item.visible = true;
        });
      } else {
        this.props.modelLabels && this.renderLabels();
      }
    } else {
      if (hasRender) {
        this.labelGroup.children.forEach(item => {
          item.visible = false;
        });
      }
    }
  };
  public empty = (elem: HTMLElement) => {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
  };
  public initTHREE = () => {
    // init renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      precision: 'highp',
      // 是否保留缓冲区直到手动清除或覆盖。否则截图是黑的
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0x050505);
    const { width, height } = this.props;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // init scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      cameraOpts.fov,
      this.aspectRatio,
      cameraOpts.near,
      cameraOpts.far
    );
    this.resetCamera();
    // init some light
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    let directionalLight1 = new THREE.AmbientLight(0xffffff, 0.6);
    let directionalLight2 = new THREE.DirectionalLight(0xc0c090);
    directionalLight1.position.set(-100, -50, 100);
    directionalLight2.position.set(100, 50, -100);
    this.scene.add(directionalLight1);
    this.scene.add(directionalLight2);
    this.scene.add(ambientLight);
  };
  initLabelRenderer = () => {
    const { width, height } = this.props;
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.outline = 'none';
    this.labelRenderer.domElement.style.top = 0 + 'px';
    this.labelRenderer.setSize(width, height);
    this.canvas.parentNode?.appendChild(this.labelRenderer.domElement);
  };
  initController = () => {
    // opts see https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
    this.controller = new OrbitControls(
      this.camera as THREE.PerspectiveCamera,
      this.labelRenderer.domElement
    );

    Object.keys(controllerOpts).forEach((item: any) => {
      // @ts-ignore
      this.controller[item] = controllerOpts[item];
    });
  };

  private _render = () => {
    this.renderer.render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    );
    this.labelRenderer.render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    );
    this.labelUtils && this.labelUtils.updateAnnotationOpacity();
  };
  private animate = () => {
    this.activeAnimationFrame = requestAnimationFrame(this.animate);
    this._render();
  };
  private recalcAspectRatio = () => {
    this.aspectRatio =
      this.canvas.offsetHeight === 0
        ? 1
        : this.canvas.offsetWidth / this.canvas.offsetHeight;
  };
  private resetCamera = () => {
    if (this.camera) {
      this.camera.position.copy(cameraOpts.posCamera);
      this.cameraTarget.copy(cameraOpts.posCameraTarget);
      this.updateCamera();
    }
  };
  private resizeDisplayGL = () => {
    this.recalcAspectRatio();
    const { height, width } = this.props;
    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
    if (this.camera) {
      this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    }
    this.updateCamera();
  };
  private updateCamera = () => {
    // if (this.camera) {
    this.camera?.lookAt(this.cameraTarget);
    this.camera?.updateProjectionMatrix();
    // }
  };
  private loadModel = () => {
    const { modelUrl } = this.props;
    this.setState({
      loading: true
    });
    let modelName = 'mesh';
    let objLoader2 = new OBJLoader2();
    let callbackOnLoad = (object3d: any) => {
      this.scene?.remove(this.activeObj);
      const boundingBox = new THREE.Box3();
      this.activeObj = object3d;
      boundingBox.setFromObject(object3d);
      const center = boundingBox.getCenter(new THREE.Vector3(0, 0, 0));
      this.initController();
      if (this.controller) {
        this.controller.target = center;
        this.controller.update();
        this.props.registerChangeEvent && this.props.registerChangeEvent();
      }
      this.scene?.add(object3d);
      this.labelGroup = new THREE.Group();
      this.scene?.add(this.labelGroup);
      this.labelUtils = new LabelUtils(
        this.scene as THREE.Scene,
        this.camera as THREE.PerspectiveCamera,
        this.labelGroup
      );
      this.setState(
        {
          loading: false
        },
        () => {
          const { showLabels, modelLabels } = this.props;
          if (showLabels && modelLabels) {
            this.renderLabels();
          }
        }
      );
    };
    const onLoadMtl = (mtlParseResult: any) => {
      objLoader2.setModelName(modelName);
      objLoader2.setLogging(true, true);
      objLoader2.addMaterials(
        MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult),
        true
      );

      objLoader2.load(
        `${globalConfig.qiuniu}${modelUrl}/mesh.obj`,
        callbackOnLoad,
        () => {},
        () => {
          message.error('模型对象加载失败!');
          this.setState({
            loading: false
          });
        }
      );
    };
    let mtlLoader = new MTLLoader();
    mtlLoader.setMaterialOptions({
      invertTrProperty: true
    });
    mtlLoader.load(
      `${globalConfig.qiuniu}${modelUrl}/mesh.mtl`,
      onLoadMtl,
      undefined,
      e => {
        message.error('模型材质加载失败!');
        this.setState({
          loading: false
        });
      }
    );
  };
  render() {
    const { height, width, id } = this.props;
    return (
      <div className="base_model_box">
        <Spin
          spinning={this.state.loading}
          size="large"
          tip="模型加载中..."
          style={{
            height: height,
            width: width
          }}
        >
          <canvas id={id}></canvas>
        </Spin>
      </div>
    );
  }
}
export default BaseModel;
