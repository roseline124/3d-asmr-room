import { SpotLight } from 'three';
import { Node } from '../models/node';

export class LightObject extends Node {
  async initalize() {
    const spotLight = new SpotLight(0xffffff); // 흰색의 스포트라이트
    spotLight.position.set(0, 5, 0); // 라이트의 위치 설정
    spotLight.angle = Math.PI / 5; // 빛의 각도 (0에서 PI/2까지)
    spotLight.penumbra = 0.1; // 빛의 펜엄브라 (부드러운 가장자리) - 0 (하드)에서 1 (부드러움)까지
    spotLight.distance = 10; // 빛의 최대 거리
    spotLight.intensity = 100; // 빛의 강도 (기본값은 1)
    spotLight.castShadow = true; // 그림자를 생성하는지 여부

    this.add(spotLight);
  }

  update() {}
}
