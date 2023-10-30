import { Object3D, PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IEventHandler } from '../models/event-handler';

export class MouseEventHandler implements IEventHandler {
  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private isDragging = false;

  constructor(
    private camera: PerspectiveCamera,
    private controls: OrbitControls,
    private object: Object3D,
  ) {}

  handle() {
    window.addEventListener(
      'mousedown',
      (event) => this.onMouseDown(event),
      false,
    );
    window.addEventListener(
      'mousemove',
      (event) => this.onMouseMove(event),
      false,
    );
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  }

  private onMouseDown(event: MouseEvent) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    let intersects = this.raycaster.intersectObject(this.object);

    if (intersects.length > 0) {
      this.isDragging = true;
      this.controls.enabled = false;
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 레이와 평면이 교차하는 지점 계산
    let intersects = this.raycaster.intersectObject(this.object);

    if (intersects.length > 0) {
      if (!this.object.children[0]) {
        return;
      }

      this.object.children[0].position.set(
        intersects[0].point.x,
        this.object.position.y,
        intersects[0].point.z,
      );
    }
  }

  private onMouseUp() {
    this.isDragging = false;
    this.controls.enabled = true;
  }
}
