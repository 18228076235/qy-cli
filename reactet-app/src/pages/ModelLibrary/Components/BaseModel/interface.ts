import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export enum ELabelClassName {
  DOT = 'model_label_dot',
  LINE = 'model_label_line',
  AREA = 'model_label_area',
  CIRCLE = 'model_label_circle'
}
export interface ICustomCSS2DObject extends CSS2DObject {
  __label__: boolean;
  cursor: string;
}
export interface ILabels {
  position: {
    x: number;
    y: number;
    z: number;
  };
  line: {
    style: {
      width: string;
      transform: string;
    };
  };
  textarea: {
    style: {
      transform: string;
      left: string;
    };
    value: string;
  };
}
export interface IProps {
  width: number;
  height: number;
  id: string;
  modelUrl: string;
  modelLabels: string;
  showLabels: boolean;
  registerChangeEvent?: () => void;
}
