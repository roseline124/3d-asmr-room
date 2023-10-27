import { Texture, TextureLoader } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { manager } from '../loading';

const gltfLoader = new GLTFLoader(manager);
const textureLoader = new TextureLoader(manager);

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
