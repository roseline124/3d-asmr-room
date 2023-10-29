import {
  AnimationClip,
  AnimationMixer,
  Clock,
  LoopRepeat,
  Object3D,
} from 'three';
import { MouseEventHandler } from '../handlers/handle-mouse-event';
import { AudioNode } from '../models/node';
import { LoaderUtil } from '../utils/loader';
import { AudioObject } from './audio';
import { handleIconClick } from '../handlers/handle-icon-click';

export class BookObject extends AudioNode {
  private clock = new Clock();
  private mixer!: AnimationMixer;
  private book!: Object3D;
  private audio!: AudioObject;

  constructor(private mouseEventHandler: MouseEventHandler) {
    super();
  }

  async initalize() {
    const { scene: book, animations } =
      await LoaderUtil.loadGLTF('models/book.glb');
    this.book = book;
    this.book.visible = false;
    this.add(book);

    this.audio = new AudioObject('sounds/book.mp3', this.book.position);
    await this.audio.loadAudio();

    this.mouseEventHandler.handle(this.book);
    handleIconClick('book-icon', this);
    this.mixer = new AnimationMixer(book);
    this.animations = animations;

    this.book.position.x += 1;
  }

  toggle() {
    const turnedOn = this.book.visible === true;
    this.book.visible = !turnedOn;

    if (this.book.visible) {
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

    this.audio?.updatePosition(this.book.position);
  }
}
