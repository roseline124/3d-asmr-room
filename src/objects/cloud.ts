import {
  AnimationMixer,
  Box3,
  Clock,
  CylinderGeometry,
  LoopRepeat,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from 'three';
import { handleIconClick } from '../handlers/handle-icon-click';
import { EventHandler } from '../models/event-handler';
import { Node } from '../models/node';
import { LoaderUtil } from '../utils/loader';
import { AudioObject } from './audio';

const raindropGeometry = new CylinderGeometry(0.01, 0.01, 0.2, 32);
const raindropMaterial = new MeshBasicMaterial({
  color: 0x3d87e7,
  transparent: true,
  opacity: 0.3,
});

export class CloudObject extends Node {
  private clock = new Clock();
  private mixer!: AnimationMixer;
  private raindrops: Mesh[] = [];
  private cloudBox!: Box3;
  private cloud!: Object3D;
  private audio!: AudioObject;

  constructor(private mouseEventHandler: EventHandler) {
    super();
  }

  async initalize() {
    const { scene: cloud, animations } =
      await LoaderUtil.loadGLTF('models/cloud.glb');
    this.cloud = cloud;
    this.cloud.visible = false;
    this.add(cloud);

    this.cloudBox = new Box3().setFromObject(this.cloud);
    this.audio = new AudioObject('sounds/rain.mp3', this.cloud.position);
    await this.audio.loadAudio();

    this.mouseEventHandler.handle(this.cloud);
    handleIconClick('cloud-icon', this);

    this.mixer = new AnimationMixer(cloud);
    this.animations = animations;
  }

  toggle() {
    const turnedOn = this.cloud.visible === true;
    this.cloud.visible = !turnedOn;

    if (this.cloud.visible) {
      this.audio.play();
      this.animations.forEach((clip) => {
        const action = this.mixer.clipAction(clip);
        action.setLoop(LoopRepeat, Infinity);
        action.play();
      });
    } else {
      this.audio.stop();
      this.animations.forEach((clip) => {
        const action = this.mixer.clipAction(clip);
        action.stop();
      });
    }
  }

  update() {
    if (!this.mixer) {
      return;
    }
    const delta = this.clock.getDelta();
    this.mixer?.update(delta);

    this.updateRainDrop();
    this.audio?.updatePosition(this.cloud.position);
  }

  private createRaindrop() {
    const raindrop = new Mesh(raindropGeometry, raindropMaterial);
    const cloudSize = this.cloudBox.getSize(new Vector3());
    const cloudCenter = this.cloudBox.getCenter(new Vector3());

    // 바운딩 박스의 크기와 위치를 기반으로 빗방울 생성 위치를 랜덤하게 설정
    raindrop.position.x = cloudCenter.x + (Math.random() - 0.5) * cloudSize.x;
    raindrop.position.y = cloudCenter.y - cloudSize.y / 2; // 바운딩 박스의 바로 아래
    raindrop.position.z = cloudCenter.z + (Math.random() - 0.5) * cloudSize.z;
    this.raindrops.push(raindrop);
    this.cloud.add(raindrop);
  }

  private updateRainDrop() {
    // 빗방울 생성
    if (Math.random() < 0.1) {
      this.createRaindrop();
    }

    // 빗방울 움직임
    for (let i = 0; i < this.raindrops.length; i++) {
      this.raindrops[i].position.y -= 0.1;

      // 화면 밖으로 나간 빗방울 제거
      if (this.raindrops[i].position.y < -10) {
        this.cloud.remove(this.raindrops[i]);
        this.raindrops.splice(i, 1);
        i--;
      }
    }
  }
}
