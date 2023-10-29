import { Object3D, PerspectiveCamera, Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EventHandler } from '../models/event-handler';

export class MouseEventHandler implements EventHandler {
  private raycaster = new Raycaster();
  private mouse = new Vector2();
  private isDragging = false;

  constructor(
    private camera: PerspectiveCamera,
    private controls: OrbitControls,
  ) {}

  handle(object: Object3D) {
    window.addEventListener(
      'mousedown',
      (event) => this.onMouseDown(event, object),
      false,
    );
    window.addEventListener(
      'mousemove',
      (event) => this.onMouseMove(event, object),
      false,
    );
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  }

  private onMouseDown(event: MouseEvent, object: Object3D) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    let intersects = this.raycaster.intersectObject(object);

    if (intersects.length > 0) {
      this.isDragging = true;
      this.controls.enabled = false;
    }
  }

  private onMouseMove(event: MouseEvent, object: Object3D) {
    if (!this.isDragging) return;

    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 레이와 평면이 교차하는 지점 계산
    let intersects = this.raycaster.intersectObject(object);

    if (intersects.length > 0) {
      object.position.set(
        intersects[0].point.x,
        object.position.y,
        intersects[0].point.z,
      );
    }
  }

  private onMouseUp() {
    this.isDragging = false;
    this.controls.enabled = true;
  }
}
