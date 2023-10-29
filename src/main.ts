import './style.css';
import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MouseEventHandler } from './handlers/handle-mouse-event';
import { BookObject } from './objects/book';
import { CatObject } from './objects/cat';
import { CloudObject } from './objects/cloud';
import { KeyboardObject } from './objects/keyboard/keyboard';
import { LightObject } from './objects/light';
import { RoomScene } from './scene/room';
import { FootStepsObject } from './objects/footsteps/footsteps';
import { FootStepMouseMoveHandler } from './objects/footsteps/handle-footstep-mouse-move';

export const renderer = createWebGLRenderer();

const app = document.getElementById('app');
app?.appendChild(renderer.domElement);

export const camera = new PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 7, -10);

camera.updateProjectionMatrix();

export const controls = new OrbitControls(camera, renderer.domElement);

export const scene = new RoomScene();

scene.setObjects(
  new LightObject(),
  new CatObject(),
  new KeyboardObject(new MouseEventHandler(camera, controls)),
  new CloudObject(new MouseEventHandler(camera, controls)),
  new BookObject(new MouseEventHandler(camera, controls)),
  new FootStepsObject(new FootStepMouseMoveHandler(camera, scene)),
);
scene.initalize();

/**
 * main function
 */
function loop() {
  requestAnimationFrame(loop);
  scene.update();
  controls.update();
  renderer.render(scene, camera);
}

loop();

function createWebGLRenderer() {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(Math.min(window.devicePixelRatio, 2), 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.setClearColor(0x000000, 0); // transparent bg

  /**
   * improvement color tone
   */
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = SRGBColorSpace;

  return renderer;
}
