import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';
import { IAudio } from '../../models/audio';
import { ToggleNode } from '../../models/node';
import { LoaderUtil } from '../../utils/loader';
import { FOOTSTEP_INIT_COUNT } from './constants';

export class FootStepsObject extends ToggleNode {
  private currentFootStepIndex = 0;
  private prevPosition: Vector3 | null = null;

  constructor(private audios: IAudio[]) {
    super();
  }

  async initalize() {
    this.visible = false;
    const footstepTexture = await LoaderUtil.loadTexture('images/footstep.png');
    const footstepGeometry = new PlaneGeometry(0.5, 0.5);
    const footstepMaterial = new MeshBasicMaterial({
      map: footstepTexture,
      transparent: true,
      side: DoubleSide,
    });

    await Promise.all(this.audios.map((audio) => audio.loadAudio()));

    for (let index = 0; index < FOOTSTEP_INIT_COUNT; index++) {
      this.addObject(footstepGeometry, footstepMaterial);
    }
  }

  private addObject(geometry: PlaneGeometry, material: MeshBasicMaterial) {
    const footstep = new Mesh(geometry, material);
    footstep.visible = false;
    footstep.rotation.x = -Math.PI / 2;
    this.add(footstep);
  }

  public toggle(): void {
    const turnedOn = this.visible === true;
    this.visible = !turnedOn;
  }

  update(): void {
    const lastFootstep =
      this.children[(this.currentFootStepIndex - 1) % FOOTSTEP_INIT_COUNT];

    if (!lastFootstep) {
      return;
    }
    this.audios.forEach((audio) => audio.updatePosition(lastFootstep.position));
  }

  updateFootStepPosition(newPosition: Vector3) {
    const footstep =
      this.children[this.currentFootStepIndex % FOOTSTEP_INIT_COUNT];
    this.currentFootStepIndex++;

    footstep.visible = true;
    footstep.position.copy(newPosition);
    footstep.position.y = 0.05;

    /**
     * footstep angle
     */
    if (this.prevPosition != null) {
      const direction = this.prevPosition.clone().sub(newPosition);
      const angleRadians = Math.atan2(direction.x, direction.z);
      footstep.rotation.z = angleRadians;
    }
    this.prevPosition = newPosition;

    /**
     * audio
     */
    if (this.currentFootStepIndex % 2 === 1) {
      footstep.scale.x = -1;
      this.audios[0].repeat();
    } else {
      this.audios[1].repeat();
    }
  }
}
