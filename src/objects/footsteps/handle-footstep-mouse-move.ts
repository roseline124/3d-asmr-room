import { Object3D, PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { EventHandler } from '../../models/event-handler';
import { FOOTSTEP_INIT_COUNT } from './constants';

export class FootStepMouseMoveHandler implements EventHandler {
  private raycaster = new Raycaster();
  private lastFootstepTime = 0;
  private footstepCooldown = 700; // create footstep in every 1000ms
  private isLeft = true;

  constructor(
    private camera: PerspectiveCamera,
    private scene: Scene,
  ) {}

  handle(object: Object3D) {
    document.addEventListener('mousemove', (event) => {
      if (!object.visible) {
        return;
      }

      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(new Vector2(mouseX, mouseY), this.camera);

      const intersects = this.raycaster.intersectObjects(this.scene.children);

      const currentTime = Date.now();
      if (currentTime - this.lastFootstepTime >= this.footstepCooldown) {
        if (intersects.length > 0) {
          const footstep =
            object.children[
              object.userData.currentIndex++ % FOOTSTEP_INIT_COUNT
            ];
          object.userData.currentIndex += 1;

          footstep.visible = true;
          const point = intersects[0].point;
          footstep.position.copy(point);
          footstep.position.y = 0.05;

          if (this.isLeft) {
            footstep.scale.x = -1;
            object.userData.audioLeft.repeat();
          } else {
            object.userData.audioRight.repeat();
          }

          this.isLeft = !this.isLeft;
        }
        this.lastFootstepTime = currentTime;
      }
    });
  }
}
