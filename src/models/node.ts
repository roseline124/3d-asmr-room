import { Object3D } from 'three';

export interface INode {
  initalize: () => Promise<void>;
  update: () => void;
}

export class Node extends Object3D implements INode {
  public async initalize() {}
  public update() {}
}
