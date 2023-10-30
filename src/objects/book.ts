import { AnimationMixer, Clock, LoopRepeat, Object3D } from 'three';
import { handleIconClick } from '../handlers/handle-icon-click';
import { IAudio } from '../models/audio';
import { EventHandler } from '../models/event-handler';
import { AudioNode } from '../models/node';
import { LoaderUtil } from '../utils/loader';

export class BookObject extends AudioNode {
  private clock = new Clock();
  private mixer!: AnimationMixer;
  private book!: Object3D;

  constructor(
    private mouseEventHandler: EventHandler,
    private audio: IAudio,
  ) {
    super();
  }

  async initalize() {
    const { scene: book, animations } =
      await LoaderUtil.loadGLTF('models/book.glb');
    this.book = book;
    this.book.visible = false;
    this.add(book);
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
