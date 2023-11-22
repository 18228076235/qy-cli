import React, { PureComponent } from 'react';
import { Menu, Spin, message } from 'antd';
import * as THREE from 'three';
import { debounce } from 'lodash-es';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';
import {
  CSS2DObject,
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LabelUtils } from '../Components/BaseModel/LabelUtils';
import {
  ELabelClassName,
  ICustomCSS2DObject
} from '../Components/BaseModel/interface';
import { controllerOpts, cameraOpts } from '../Components/BaseModel/constants';
//@ts-ignore
import { Interaction } from 'three.interaction';
import globalConfig from 'global/globalConfig';
interface IProps {
  id: string;
  modelUrl: string;
  modelLabels: string;
  modelLandmark: string;
  showLabels: boolean;
  showLandmark: boolean;
  isEdit: boolean;
}
const initState = {
  loading: true,
  rightMenuLeft: 0,
  rightMenuTop: 0,
  isShowRight: false
};

type TState = Readonly<typeof initState>;
class Model extends PureComponent<IProps, TState> {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  cameraTarget = new THREE.Vector3(0, 0, 0);
  renderer: THREE.WebGLRenderer;
  aspectRatio: number = 1;
  controller: OrbitControls | null;
  canvas: HTMLCanvasElement;
  activeAnimationFrame: number;
  labelRenderer: CSS2DRenderer;
  mouse = {
    x: 0,
    y: 0
  };
  raycaster: THREE.Raycaster;
  // 鼠标是否点下
  isDown: boolean;
  // 当前点击的对象
  target: any;
  dots: any[] = [];
  vertices: any[] = [];
  // 是否是正在创建标注对象
  isCreate: boolean;
  filterClassName = [
    ELabelClassName.DOT,
    ELabelClassName.LINE,
    ELabelClassName.AREA,
    ELabelClassName.CIRCLE
  ];
  obj: any;
  state: TState = initState;
  labelUtils: LabelUtils;
  INTERSECTED: any;
  group: THREE.Group;
  labelGroup: THREE.Group;
  interaction: any;
  points: any[] = [];
  activeDel: any;
  componentDidMount() {
    this.canvas = document.getElementById(this.props.id) as HTMLCanvasElement;
    this.initTHREE();
    this.initLabelRenderer();
    this.initRaycaster();
    this.resizeDisplayGL();
    this.props.modelUrl && this.loadModel();
    this.registerEvent();
    this.interaction = new Interaction(
      this.labelRenderer,
      this.scene,
      this.camera
    );

    this.animate();
  }
  componentDidUpdate(prevProps: IProps) {
    if (this.props.modelUrl !== prevProps.modelUrl) {
      this.loadModel();
    }
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.activeAnimationFrame);
    this.unRegisterEvent();
    this.scene?.dispose();
    this.scene = null;
    this.camera = null;
    this.controller = null;
    this.empty(this.canvas);
  }
  public empty = (elem: HTMLElement) => {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
  };
  registerEvent = () => {
    this.labelRenderer.domElement.addEventListener(
      'mousemove',
      this.labelMouseMove
    );
    this.labelRenderer.domElement.addEventListener(
      'mousedown',
      this.labelMouseDown
    );
    this.labelRenderer.domElement.addEventListener(
      'mouseup',
      this.labelMouseUp
    );
    this.labelRenderer.domElement.addEventListener(
      'dblclick',
      this.labeldblClick
    );
    this.labelRenderer.domElement.addEventListener(
      'contextmenu',
      this.onContextmenu
    );
    window.addEventListener(
      'resize',
      debounce(this.resizeDisplayGL, 16.7),
      false
    );
    window.addEventListener('mousemove', this.onMouseMove, false);
  };
  unRegisterEvent = () => {
    this.labelRenderer.domElement.removeEventListener(
      'contextmenu',
      this.onContextmenu
    );
    this.labelRenderer.domElement.removeEventListener(
      'mousemove',
      this.labelMouseMove
    );
    this.labelRenderer.domElement.removeEventListener(
      'mousedown',
      this.labelMouseDown
    );
    this.labelRenderer.domElement.removeEventListener(
      'mouseup',
      this.labelMouseUp
    );
    this.labelRenderer.domElement.removeEventListener(
      'dblclick',
      this.labeldblClick
    );
    window.removeEventListener(
      'resize',
      debounce(this.resizeDisplayGL, 16.7),
      false
    );
    window.removeEventListener('mousemove', this.onMouseMove, false);
  };
  onContextmenu = (e: any) => {
    if (e.target.className === ELabelClassName.AREA) {
      this.rightMenu(e);
    }
  };
  getAngle = (x1: number, x2: number, y1: number, y2: number) => {
    return Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
  };
  getLongSideWidth = (x1: number, x2: number, y1: number, y2: number) => {
    const side1 = Math.abs(x1 - x2);
    const side2 = Math.abs(y1 - y2);
    const side3 = Math.sqrt(side1 ** 2 + side2 ** 2);
    return side3;
  };
  labelMouseMove = (e: MouseEvent) => {
    if (!this.props.isEdit) return;

    const target = e.target as HTMLElement;
    const flag =
      this.isCreate &&
      this.filterClassName.every(item => item !== target.className);
    if (flag && this.target.style.transform) {
      const [target_x, target_y] = this.target.style.transform
        .split(`translate(`)[2]
        .replace(/px|\)/g, '')
        .split(',')
        .map((i: string) => +i);
      const { offsetX, offsetY } = e;
      const longSideWidth = this.getLongSideWidth(
        offsetX,
        target_x,
        offsetY,
        target_y
      );
      const line = [...this.target.children].find(
        item => item.className === ELabelClassName.LINE
      );
      if (line) {
        line.style.width = longSideWidth + 'px';
        let angle = this.getAngle(offsetX, target_x, offsetY, target_y);
        line.style.transform = `rotate(${angle}deg)`;
      }
    }
    if (this.isDown && this.controller) this.controller.enabled = false;
    const isDragArea =
      this.isDown &&
      this.filterClassName.every(item => item !== target.className);
    if (isDragArea) {
      const dot = this.target.parentNode.parentNode;
      const line = this.target.parentNode;
      const [target_x, target_y] = dot.style.transform
        .split(`translate(`)[2]
        .replace(/px|\)/g, '')
        .split(',')
        .map((i: string) => +i);
      const { offsetX, offsetY } = e;
      const angle = this.getAngle(offsetX, target_x, offsetY, target_y);
      line.style.transform = `rotate(${angle}deg)`;

      const longSideWidth = this.getLongSideWidth(
        offsetX,
        target_x,
        offsetY,
        target_y
      );
      line.style.width = longSideWidth + 'px';
      this.target.style.left = longSideWidth + 'px';
      this.target.style.transform = `rotate(${-angle}deg)`;
    }
  };
  labelMouseDown = (e: MouseEvent) => {
    if (!this.props.isEdit) return;
    if (e.which === 3) return;
    if (this.state.isShowRight) {
      this.setState({
        isShowRight: false
      });
      return;
    }
    const target = e.target as HTMLElement;
    if (this.isCreate) {
      this.isCreate = false;
      const line = [...this.target.children].find(
        item => item.className === ELabelClassName.LINE
      );
      if (line) {
        const textarea = [...line.children].find(
          item => item.className === ELabelClassName.AREA
        );

        textarea.style.left = line.style.width;
        const deg = parseFloat(
          line.style.transform.split(' ')[0].replace(/rotate\(|\)/g, '')
        );
        textarea.style.transform = `rotate(${-deg}deg)`;
        textarea.style.display = 'block';

        requestAnimationFrame(() => {
          textarea.focus();
        });
      }
      this.target = null;
    }
    if (target.className === ELabelClassName.AREA) {
      this.isDown = true;
      this.target = e.target;
    }
  };
  labelMouseUp = () => {
    if (!this.props.isEdit) return;
    if (this.isDown) {
      this.isDown = false;
      this.controller && (this.controller.enabled = true);
      this.target = null;
    }
  };
  labeldblClick = (e: MouseEvent) => {
    if (!this.props.isEdit) return;
    try {
      const target = e.target as HTMLElement;
      // 无法在标注过的地方在进行标注
      if (target.className === ELabelClassName.DOT) {
        return;
      }
      // 双击聚焦文本框
      if (target.className === ELabelClassName.AREA) {
        const allAreas = document.getElementsByClassName(ELabelClassName.AREA);
        for (let i of allAreas) {
          if (i === e.target) {
            target.focus();
          } else {
            // @ts-ignore
            i.blur();
          }
        }
        return;
      }

      // 双击获取当前三维点
      if (this.camera && this.scene) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
          this.scene.children.filter(i => i.name === 'face'),
          true
        );
        if (intersects[0]) {
          const obj = intersects[0];
          if (obj) {
            const { x, y, z } = obj.point;
            const { dot } = this.labelUtils.addLabel(x, y, z);
            this.isCreate = true;
            this.target = dot;
          }
        }
      }
    } catch (error) {
      console.error('dblError:', error);
    }
  };
  initLabelRenderer = () => {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.outline = 'none';
    this.labelRenderer.domElement.style.top = 0 + 'px';
    // this.labelRenderer.domElement.style.transform = 'translateZ(0)';
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    document
      .getElementsByClassName('model_edit_box')[0]
      .appendChild(this.labelRenderer.domElement);
  };
  onMouseMove = (event: MouseEvent) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  getLabels = () => {
    return this.labelUtils.getLabels();
  };
  public initController = () => {
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
  initRaycaster = () => {
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster(
      (this.camera as THREE.PerspectiveCamera).position,
      undefined,
      0.1,
      10000
    );
  };
  public initTHREE = () => {
    // init renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      precision: 'highp'
    });
    this.renderer.setClearColor(0x050505);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
  private resetCamera = () => {
    if (this.camera) {
      this.camera.position.copy(cameraOpts.posCamera);
      this.cameraTarget.copy(cameraOpts.posCameraTarget);
      this.updateCamera();
    }
  };
  private updateCamera = () => {
    if (this.camera) {
      this.camera.lookAt(this.cameraTarget);
      this.camera.updateProjectionMatrix();
    }
  };
  private resizeDisplayGL = () => {
    this.recalcAspectRatio();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    if (this.camera) {
      this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
    }
    this.updateCamera();
  };
  rightMenu = (e: any) => {
    e.preventDefault();
    this.activeDel = e.target;
    const position = {
      x: e.pageX,
      y: e.pageY
    };
    this.setState({
      rightMenuLeft: position.x,
      rightMenuTop: position.y,
      isShowRight: true
    });
  };
  _rightMenuClick = () => {
    if (this.scene) {
      const obj2d = this.labelGroup.children
        .filter((item: any) => item.__label__)
        .find((item: any) => {
          return item.element === this.activeDel.parentNode.parentNode;
        });
      if (obj2d) {
        this.labelGroup.remove(obj2d);
      }

      this.setState({
        isShowRight: false
      });
    }
  };
  private renderLabels = () => {
    try {
      const res = JSON.parse(this.props.modelLabels);
      this.labelUtils.renderLabel(res);
    } catch (error) {
      message.error('渲染标注点失败');
    }
  };
  private renderLandmark = () => {
    try {
      const res = JSON.parse(this.props.modelLandmark);

      res.forEach((item: any) => {
        var radius = 0.002,
          segemnt = 16,
          rings = 16;

        var sphereMaterial = new THREE.MeshLambertMaterial({
          color: 0xcc0000
        });

        var sphere = new THREE.Mesh(
          new THREE.SphereBufferGeometry(radius, segemnt, rings),
          sphereMaterial
        );
        sphere.position.set(item.x, item.y, item.z);
        //@ts-ignore
        sphere.cursor = 'pointer';
        //@ts-ignore
        sphere.on('click', ev => {
          if (!this.props.isEdit) return;
          if (this.points.length === 0) {
            this.group.children.forEach((item: THREE.Mesh) => {
              //@ts-ignore
              item?.material?.color?.setHex(0xff0000);
            });
          }
          ev.data.target.material.color.setHex(0x00ff00);
          this.points.push(ev.data.target.position);
          if (this.points.length === 2) {
            const distance = (this.points[0] as THREE.Vector3).distanceTo(
              this.points[1] as THREE.Vector3
            );
            setTimeout(() => {
              message.info(
                `特征点之间的距离为:${(distance * 100).toFixed(4)}厘米`
              );
              this.points.length = 0;
            }, 200);
          }
        });
        this.group?.add(sphere);
      });
    } catch (error) {
      message.error('渲染特征点失败');
    }
  };
  public changeDisplayLandmark = () => {
    const hasRender = this.group.children.length > 0;
    if (this.props.showLandmark) {
      if (hasRender) {
        this.group.visible = true;
      } else {
        this.props.modelLandmark && this.renderLandmark();
      }
    } else {
      if (hasRender) {
        this.group.visible = false;
      }
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
  private recalcAspectRatio = () => {
    this.aspectRatio =
      this.canvas.offsetHeight === 0
        ? 1
        : this.canvas.offsetWidth / this.canvas.offsetHeight;
  };
  private loadModel = () => {
    const modelUrl = globalConfig.qiuniu + this.props.modelUrl + '/';
    let modelName = 'face_model';
    let objLoader2 = new OBJLoader2();
    let callbackOnLoad = (object3d: any) => {
      object3d.name = 'face';
      this.labelUtils = new LabelUtils(
        this.scene as THREE.Scene,
        this.camera as THREE.PerspectiveCamera,
        this.labelGroup
      );
      const boundingBox = new THREE.Box3();

      boundingBox.setFromObject(object3d);
      const center = boundingBox.getCenter(new THREE.Vector3(0, 0, 0));
      this.group = new THREE.Group();
      this.labelGroup = new THREE.Group();
      this.scene?.add(object3d);
      this.scene?.add(this.group);
      this.scene?.add(this.labelGroup);
      this.labelUtils = new LabelUtils(
        this.scene as THREE.Scene,
        this.camera as THREE.PerspectiveCamera,
        this.labelGroup
      );
      this.initController();
      if (this.controller) {
        this.controller.target = center;
        this.controller.update();
      }
      this.setState(
        {
          loading: false
        },
        () => {
          const {
            showLabels,
            modelLabels,
            modelLandmark,
            showLandmark
          } = this.props;
          if (showLabels && modelLabels) {
            this.renderLabels();
          }
          if (modelLandmark && showLandmark) {
            this.renderLandmark();
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
        `${modelUrl}/mesh.obj`,
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
    mtlLoader.load(`${modelUrl}/mesh.mtl`, onLoadMtl, undefined, e => {
      message.error('模型材质加载失败!');
      this.setState({
        loading: false
      });
    });
  };
  private animate = () => {
    this.activeAnimationFrame = requestAnimationFrame(this.animate);
    this._render();
  };
  _render = () => {
    this.renderer.render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    );
    this.labelRenderer.render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    );
    this.controller?.update();
  };
  render() {
    return (
      <div>
        <Spin spinning={this.state.loading} size="large" tip="模型加载中...">
          <canvas id={this.props.id}></canvas>
          <div
            className="right_menu"
            style={{
              display: this.state.isShowRight ? 'block' : 'none',
              left: this.state.rightMenuLeft,
              top: this.state.rightMenuTop
            }}
          >
            <Menu onClick={this._rightMenuClick}>
              <Menu.Item>删除</Menu.Item>
            </Menu>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Model;
