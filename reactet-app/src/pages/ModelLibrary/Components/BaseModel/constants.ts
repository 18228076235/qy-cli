import * as THREE from 'three';

export const controllerOpts = {
  maxAzimuthAngle: Math.PI / 2,
  minAzimuthAngle: -Math.PI / 2,
  maxPolarAngle: Math.PI,
  minPolarAngle: Math.PI / 4
};
export const cameraOpts = {
  posCamera: new THREE.Vector3(0.0, 0.0, 0.9),
  posCameraTarget: new THREE.Vector3(0, 0, 0),
  near: 0.1,
  far: 10000,
  fov: 22
};
