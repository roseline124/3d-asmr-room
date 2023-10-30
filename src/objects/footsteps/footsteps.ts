import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { IAudio } from '../../models/audio';
import { ToggleNode } from '../../models/node';
import { LoaderUtil } from '../../utils/loader';
import { FOOTSTEP_INIT_COUNT } from './constants';

export class FootStepsObject extends ToggleNode {
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

    this.userData.audioLeft = this.audios[0];
    this.userData.audioRight = this.audios[1];
    await this.userData.audioLeft.loadAudio();
    await this.userData.audioRight.loadAudio();

    for (let index = 0; index < FOOTSTEP_INIT_COUNT; index++) {
      this.addObject(footstepGeometry, footstepMaterial);
    }
    this.userData.currentIndex = 0;
  }

  private addObject(geometry: PlaneGeometry, material: MeshBasicMaterial) {
    const footstep = new Mesh(geometry, material);
    footstep.visible = false;
    footstep.rotation.x = -Math.PI / 2;
    this.children.push(footstep);
  }

  public toggle(): void {
    const turnedOn = this.visible === true;
    this.visible = !turnedOn;
  }

  update(): void {
    const lastFootstep =
      this.children[this.userData.currentIndex % FOOTSTEP_INIT_COUNT];
    if (!lastFootstep) {
      return;
    }
    this.userData.audioLeft?.updatePosition(lastFootstep.position);
    this.userData.audioRight?.updatePosition(lastFootstep.position);
  }
}
