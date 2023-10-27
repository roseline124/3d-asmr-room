import { AnimationMixer, Clock, LoopRepeat, Object3D } from 'three';
import { MouseEventHandler } from '../handlers/handle-mouse-event';
import { Node } from '../models/node';
import { LoaderUtil } from '../utils/loader';
import { AudioObject } from './audio';

export class BookObject extends Node {
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
    this.add(book);

    this.audio = new AudioObject('sounds/book.mp3', this.book.position);
    await this.audio.loadAudio();
    this.audio.play();

    this.mouseEventHandler.handle(this.book);

    this.mixer = new AnimationMixer(book);
    animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      action.setLoop(LoopRepeat, Infinity);
      action.play();
    });

    this.book.position.x += 1;
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
