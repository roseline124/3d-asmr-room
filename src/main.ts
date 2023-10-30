import './style.css';
import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MouseEventHandler } from './handlers/mouse-event-handler';
import { BookObject } from './objects/book';
import { CatObject } from './objects/cat';
import { CloudObject } from './objects/cloud';
import { KeyboardObject } from './objects/keyboard/keyboard';
import { LightObject } from './objects/light';
import { RoomScene } from './scene/room';
import { FootStepsObject } from './objects/footsteps/footsteps';
import { AudioObject } from './objects/audio';
import { IconClickHandler } from './handlers/icon-click-handler';
import { FootStepMouseMoveHandler } from './handlers/footstep-mouse-move-handler';

const initialWindowSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};
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

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  const aspectRatioChange = window.innerWidth / initialWindowSize.width + 0.2;
  camera.zoom = aspectRatioChange;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export const scene = new RoomScene();

/**
 * init scene
 */
const keyboardObject = new KeyboardObject([
  new AudioObject('sounds/keyboard1.mp3', false),
  new AudioObject('sounds/keyboard2.mp3', false),
  new AudioObject('sounds/keyboard3.mp3', false),
]);
const cloudObject = new CloudObject(new AudioObject('sounds/rain.mp3'));
const bookObject = new BookObject(new AudioObject('sounds/book.mp3'));
const footstepsObject = new FootStepsObject([
  new AudioObject('sounds/footstep_left.mp3', false),
  new AudioObject('sounds/footstep_right.mp3', false),
]);
scene.addObjects(
  new LightObject(),
  new CatObject(),
  keyboardObject,
  cloudObject,
  bookObject,
  footstepsObject,
);
scene.handleEvents([
  new MouseEventHandler(camera, controls, keyboardObject),
  new MouseEventHandler(camera, controls, cloudObject),
  new MouseEventHandler(camera, controls, bookObject),
  new IconClickHandler('keyboard-icon', keyboardObject),
  new IconClickHandler('cloud-icon', cloudObject),
  new IconClickHandler('book-icon', bookObject),
  new IconClickHandler('footstep-icon', footstepsObject),
  new FootStepMouseMoveHandler(camera, controls, scene, footstepsObject),
]);
scene.initalize();

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
