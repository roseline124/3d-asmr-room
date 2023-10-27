import { Object3D, Vector3 } from 'three';
import { Tween } from 'three/examples/jsm/libs/tween.module.js';
import { MouseEventHandler } from '../handlers/handle-mouse-event';
import { Node } from '../models/node';
import { LoaderUtil } from '../utils/loader';
import { AudioObject } from './audio';

export class KeyboardObject extends Node {
  private keyboard!: Object3D;
  private audioKey1!: AudioObject;
  private audioKey2!: AudioObject;
  private audioKey3!: AudioObject;

  private tweenKeyDown?: Tween<Vector3>;
  private tweenKeyUp?: Tween<Vector3>;
  private originalKeyYPosition!: number;

  constructor(private mouseEventHandler: MouseEventHandler) {
    super();
  }

  async initalize() {
    const { scene: keyboard } = await LoaderUtil.loadGLTF(
      'models/keyboard.glb',
    );
    this.keyboard = keyboard;
    this.add(keyboard);

    const enterKey = this.getTargetKeyObject('Enter');
    if (enterKey != null) {
      this.originalKeyYPosition = enterKey.position.y;
    } else {
      this.originalKeyYPosition = keyboard.children[0].position.y;
    }

    this.audioKey1 = new AudioObject(
      'sounds/keyboard1.mp3',
      this.keyboard.position,
      false,
    );
    this.audioKey2 = new AudioObject(
      'sounds/keyboard2.mp3',
      this.keyboard.position,
      false,
    );
    this.audioKey3 = new AudioObject(
      'sounds/keyboard3.mp3',
      this.keyboard.position,
      false,
    );
    await Promise.all(
      [this.audioKey1, this.audioKey2, this.audioKey3].map((audio) => {
        audio.loadAudio();
      }),
    );

    window.addEventListener('keydown', this.handleKeydown.bind(this));
    this.mouseEventHandler.handle(this.keyboard);

    this.keyboard.position.x -= 1;
  }

  update() {
    this.tweenKeyDown?.update();
    this.tweenKeyUp?.update();

    this.audioKey1?.updatePosition(this.keyboard.position);
    this.audioKey2?.updatePosition(this.keyboard.position);
    this.audioKey3?.updatePosition(this.keyboard.position);
  }

  private handleKeydown(event: KeyboardEvent) {
    const targetObject = this.getTargetKeyObject(event.code);
    if (!targetObject) {
      return;
    }

    this.tweenKeyDown = new Tween(targetObject.position)
      .to({ y: this.originalKeyYPosition - 0.01 }, 150)
      .start()
      .onStart(() => {
        const randomIndex = Math.floor(Math.random() * 3);
        [this.audioKey1, this.audioKey2, this.audioKey3][randomIndex].repeat();
      })
      .onComplete(() => {
        // 키를 떼면 원래 위치로 돌아가는 애니메이션
        this.tweenKeyUp = new Tween(targetObject.position)
          .to({ y: this.originalKeyYPosition }, 150)
          .start();
      });
  }

  private getTargetKeyObject(key: string) {
    return this.keyboard.children.find((child) => {
      const keyStr = key.toLocaleLowerCase();

      if (keyStr === child.name) {
        return true;
      }

      if (keyStr.includes('shift') && child.name === 'shift') {
        return true;
      }

      return `key${child.name}` === keyStr;
    });
  }
}
