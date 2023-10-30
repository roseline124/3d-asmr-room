import { Object3D, Vector3 } from 'three';
import { Tween } from 'three/examples/jsm/libs/tween.module.js';
import { IAudio } from '../../models/audio';
import { ToggleNode } from '../../models/node';
import { LoaderUtil } from '../../utils/loader';
import { KeyboardModal } from './modal';

export class KeyboardObject extends ToggleNode {
  private keyboard!: Object3D;

  private tweenKeyDown?: Tween<Vector3>;
  private tweenKeyUp?: Tween<Vector3>;
  private originalKeyYPosition!: number;
  private modal = new KeyboardModal();

  constructor(private audios: IAudio[]) {
    super();
  }

  async initalize() {
    const { scene: keyboard } = await LoaderUtil.loadGLTF(
      'models/keyboard.glb',
    );
    this.keyboard = keyboard;
    this.keyboard.visible = false;
    this.add(keyboard);

    const enterKey = this.getTargetKeyObject('Enter');
    if (enterKey != null) {
      this.originalKeyYPosition = enterKey.position.y;
    } else {
      this.originalKeyYPosition = keyboard.children[0].position.y;
    }

    await Promise.all(this.audios.map((audio) => audio.loadAudio()));

    window.addEventListener('keydown', this.handleKeydown.bind(this));

    this.keyboard.position.x -= 1;
  }

  toggle() {
    const turnedOn = this.keyboard.visible === true;
    this.keyboard.visible = !turnedOn;
  }

  update() {
    if (!this.keyboard) {
      return;
    }

    this.tweenKeyDown?.update();
    this.tweenKeyUp?.update();

    this.audios.forEach((audio) => {
      audio.updatePosition(this.keyboard.position);
    });
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.modal.modalOpen) {
      return;
    }

    const targetObject = this.getTargetKeyObject(event.code);
    if (!targetObject) {
      return;
    }

    this.tweenKeyDown = new Tween(targetObject.position)
      .to({ y: this.originalKeyYPosition - 0.01 }, 150)
      .start()
      .onStart(() => {
        const randomIndex = Math.floor(Math.random() * 3);
        this.audios[randomIndex].repeat();
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
