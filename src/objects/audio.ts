import { Vector3 } from 'three';

export class AudioObject {
  private panner: PannerNode;
  private audioContext: AudioContext;
  private source: AudioBufferSourceNode;
  private buffer?: AudioBuffer;

  constructor(
    private filePath: string,
    private position: Vector3,
    private loop = true,
  ) {
    const audioContext = new AudioContext();

    this.audioContext = audioContext;

    this.source = this.audioContext.createBufferSource();
    this.panner = this.audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = 1;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 1;
    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 0;
    this.panner.coneOuterGain = 0;

    document.addEventListener('click', function startAudioOnce() {
      audioContext.resume().then(() => {
        document.removeEventListener('click', startAudioOnce);
      });
    });
  }

  async loadAudio() {
    const response = await fetch(this.filePath);
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.init();

    return this;
  }

  private init() {
    this.source = this.audioContext.createBufferSource();
    if (!this.buffer) {
      throw new Error('audio data not exists');
    }

    this.source.buffer = this.buffer;
    this.source.loop = this.loop;
    this.source.connect(this.panner);
    this.panner.connect(this.audioContext.destination);
  }

  play() {
    this.source.start();
  }

  stop() {
    this.source.stop();
    this.init();
  }

  repeat() {
    this.init();
    this.play();
  }

  updatePosition(newPosition: Vector3) {
    this.position = newPosition;
    this.panner.positionX.value = this.position.x;
    this.panner.positionY.value = this.position.y;
    this.panner.positionZ.value = this.position.z;
  }
}
