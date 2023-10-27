import { BufferGeometry, Material, Mesh, Vector3 } from 'three';

export class Particle extends Mesh {
  velocity = new Vector3();
  lifetime = 1; // 1초 동안의 수명

  constructor(geometry: BufferGeometry, material: Material) {
    super(geometry, material);
  }
}
