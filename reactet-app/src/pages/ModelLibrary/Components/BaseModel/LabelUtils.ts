import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { ICustomCSS2DObject, ELabelClassName, ILabels } from './interface';
import { ClampToEdgeWrapping } from 'three';

export class LabelUtils {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  dots: any[] = [];
  obj: any;
  labelGroup: THREE.Group;
  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    labelGroup: THREE.Group
  ) {
    this.scene = scene;
    this.camera = camera;
    this.labelGroup = labelGroup;
  }
  createObj2D = (elem: HTMLElement) => {
    return new CSS2DObject(elem) as ICustomCSS2DObject;
  };
  createDom() {
    const dot = document.createElement('div');
    const line = document.createElement('div');
    const textarea = document.createElement('textarea');
    dot.className = ELabelClassName.DOT;
    line.className = ELabelClassName.LINE;
    textarea.className = ELabelClassName.AREA;
    textarea.spellcheck = false;
    textarea.style.display = 'none';
    line.appendChild(textarea);
    dot.appendChild(line);
    return {
      dot,
      line,
      textarea
    };
  }
  /**
   * @addLabel 双击增加label
   */
  addLabel(x: number, y: number, z: number) {
    const dom = this.createDom();
    const obj2D = this.createObj2D(dom.dot);
    obj2D.position.set(x, y, z);
    obj2D.__label__ = true;
    this.labelGroup.add(obj2D);
    this.dots.push(obj2D);
    return dom;
  }
  /**
   * @renderLabel 渲染单个模型上已经有的labels
   */
  renderLabel(labels: ILabels[]) {
    labels.forEach(item => {
      const dom = this.createDom();
      const { dot, line, textarea } = dom;
      line.style.width = item.line.style.width;
      line.style.transform = item.line.style.transform;
      textarea.style.transform = item.textarea.style.transform;
      textarea.style.left = item.textarea.style.left;
      textarea.value = item.textarea.value;
      textarea.style.display = 'block';
      const obj2D = this.createObj2D(dot);
      obj2D.__label__ = true;
      const { x, y, z } = item.position;
      obj2D.position.set(x, y, z);
      this.labelGroup.add(obj2D);
      this.dots.push(obj2D);
    });
  }
  updateAnnotationOpacity = () => {
    // if (this.dots.length === 0) return;
    // if (!this.obj) {
    //   const obj = this.scene.children.find(item => item.type === 'Object3D');
    //   if (obj) {
    //     this.obj = obj;
    //   }
    // }
    // if (this.obj && this.dots.length > 0 && this.camera) {
    //   const meshDistance = this.camera.position.distanceTo(this.obj.position);
    //   for (let i = 0; i < this.dots.length; i++) {
    //     const item = this.dots[i];
    //     const flag =
    //       meshDistance > this.camera.position.distanceTo(item.position);
    //     item.element.style.opacity = flag ? 1 : 0.25;
    //   }
    // }
  };
  getLabels() {
    try {
      const labels = this.labelGroup.children
        .filter((item: ICustomCSS2DObject) => item.__label__)
        .map(item => {
          const obj: any = {};
          obj.position = item.position;
          // @ts-ignore
          const child = [...item.element.children];
          const line = child.find(
            item => item.className === ELabelClassName.LINE
          );
          obj.line = {
            style: {
              width: line.style.width,
              transform: line.style.transform
            }
          };
          const textarea = line.children[0];
          obj.textarea = {
            style: {
              transform: textarea.style.transform,
              left: textarea.style.left
            },
            value: textarea.value
          };
          return obj;
        });
      return JSON.stringify(labels);
    } catch (error) {
      console.error('getLabelsError:', error);
      return null;
    }
  }
}
