import { Object3D } from 'three';

export interface EventHandler {
  handle: (object: Object3D) => void;
}
