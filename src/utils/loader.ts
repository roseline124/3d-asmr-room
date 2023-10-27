import { Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

export class LoaderUtil {
  public static loadGLTF(path: string) {
    return new Promise<GLTF>((resolve, reject) => {
      gltfLoader.load(path, resolve, undefined, reject);
    });
  }

  public static loadTexture(path: string) {
    return new Promise<Texture>((resolve, reject) => {
      textureLoader.load(path, resolve, undefined, reject);
    });
  }
}
