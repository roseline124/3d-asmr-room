import {
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from 'three';
import { FOOTSTEP_INIT_COUNT } from '../objects/footsteps/constants';
import { IEventHandler } from '../models/event-handler';

export class FootStepMouseMoveHandler implements IEventHandler {
  private raycaster = new Raycaster();
  private lastFootstepTime = 0;
  private footstepCooldown = 700; // create footstep in every 700ms
  private isLeft = true;
  private prevPosition: Vector3 | null = null;

  constructor(
    private camera: PerspectiveCamera,
    private scene: Scene,
    private object: Object3D,
  ) {}

  handle() {
    document.addEventListener('mousemove', (event) => {
      if (!this.object.visible) {
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
            this.object.children[
              this.object.userData.currentIndex++ % FOOTSTEP_INIT_COUNT
            ];
          this.object.userData.currentIndex += 1;

          footstep.visible = true;
          const point = intersects[0].point;
          footstep.position.copy(point);
          footstep.position.y = 0.05;

          /**
           * footstep angle
           */
          if (this.prevPosition != null) {
            const direction = this.prevPosition.clone().sub(point);
            const angleRadians = Math.atan2(direction.x, direction.z);
            footstep.rotation.z = angleRadians;
          }
          this.prevPosition = point;

          /**
           * audio
           */
          if (this.isLeft) {
            footstep.scale.x = -1;
            this.object.userData.audioLeft.repeat();
          } else {
            this.object.userData.audioRight.repeat();
          }

          this.isLeft = !this.isLeft;
        }
        this.lastFootstepTime = currentTime;
      }
    });
  }
}
