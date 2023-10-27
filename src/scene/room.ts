import { Color, Object3D, Scene } from 'three';
import { INode } from '../models/node';
import { LoaderUtil } from '../utils/loader';

export class RoomScene extends Scene implements INode {
  room!: Object3D;

  #objects: Object3D[] = [];

  setObjects(...objects: Object3D[]) {
    this.#objects = objects;
    this.#objects.forEach((obj) => {
      this.add(obj);
    });
  }

  async initalize() {
    const { scene: room } = await LoaderUtil.loadGLTF('models/asmr_room.glb');

    this.background = new Color(0x00000);
    this.room = room;
    this.add(this.room);
    await Promise.all(this.#objects.map((obj: any) => obj.initalize()));
  }

  update() {
    this.updateMatrixWorld(true);
    this.#objects.forEach((obj: any) => obj.update());
  }
}
