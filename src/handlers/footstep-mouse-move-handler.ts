import { PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IEventHandler } from '../models/event-handler';
import { FootStepsObject } from '../objects/footsteps/footsteps';

export class FootStepMouseMoveHandler implements IEventHandler {
  private raycaster = new Raycaster();
  private isDragging = false;
  private lastFootstepTime = 0;
  private footstepCooldown = 700; // create footstep in every 700ms

  constructor(
    private camera: PerspectiveCamera,
    private controls: OrbitControls,
    private scene: Scene,
    private object: FootStepsObject,
  ) {}

  handle() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    window.addEventListener(
      'touchmove',
      (event) => this.onTouchMove(event.touches[0]),
      false,
    );
    window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
  }

  private onTouchStart() {
    this.isDragging = true;
    this.controls.enabled = false;
  }

  private onMouseMove(event: MouseEvent) {
    event.preventDefault();
    this.onMove(event);
  }

  private onTouchMove(evnet: Touch) {
    if (!this.isDragging) {
      return;
    }

    this.onMove(evnet);
  }

  private onTouchEnd() {
    this.isDragging = false;
    this.controls.enabled = true;
  }

  private onMove(event: MouseEvent | Touch) {
    if (!this.object.visible) {
      return;
    }

    this.controls.enabled = false;

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
  }
}
