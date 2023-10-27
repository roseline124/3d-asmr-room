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
import { KeyboardObject } from './objects/keyboard';
import { LightObject } from './objects/light';
import { RoomScene } from './scene/room';

export const renderer = createWebGLRenderer();

const app = document.getElementById('app');
app?.appendChild(renderer.domElement);

export const camera = new PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
); // FOV는 60으로 설정
camera.position.set(0, 7, -10);
// camera.rotation.set(57.18, 0, 56.84);

camera.updateProjectionMatrix();

export const controls = new OrbitControls(camera, renderer.domElement);

export const scene = new RoomScene();
/**
 * 여기에 오브젝트들 추가
 */
scene.setObjects(
  new LightObject(),
  new CatObject(),
  new KeyboardObject(new MouseEventHandler(camera, controls)),
  new CloudObject(new MouseEventHandler(camera, controls)),
  new BookObject(new MouseEventHandler(camera, controls)),
);
scene.initalize();

/**
 * main 함수
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
  renderer.setClearColor(0x000000, 0); // 투명한 배경
  /**
   * 색상, 명암 개선
   */
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = SRGBColorSpace;

  return renderer;
}
