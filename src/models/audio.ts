import { Vector3 } from 'three';

export interface IAudio {
  loadAudio: () => Promise<void>;
  play: () => void;
  stop: () => void;
  repeat: () => void;
  updatePosition: (newPosition: Vector3) => void;
}
