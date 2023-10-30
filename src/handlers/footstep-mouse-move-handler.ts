import { PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { IEventHandler } from '../models/event-handler';
import { FootStepsObject } from '../objects/footsteps/footsteps';

export class FootStepMouseMoveHandler implements IEventHandler {
  private raycaster = new Raycaster();
  private lastFootstepTime = 0;
  private footstepCooldown = 700; // create footstep in every 700ms

  constructor(
    private camera: PerspectiveCamera,
    private scene: Scene,
    private object: FootStepsObject,
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
          this.object.updateFootStepPosition(intersects[0].point);
        }
        this.lastFootstepTime = currentTime;
      }
    });
  }
}
