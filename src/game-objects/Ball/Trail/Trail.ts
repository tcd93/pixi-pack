import { Sprite } from 'pixi.js';
import { Emitter } from 'pixi-particles';

export class Trail {
  private emitter: Emitter;

  constructor(private sprite: Sprite) {
    const texture = sprite.texture;

    this.emitter = new Emitter(sprite.parent, [texture], {
      autoUpdate: true,
      pos: {
        x: 0,
        y: 0
      },
      alpha: {
        start: 0.75,
        end: 0
      },
      speed: {
        start: 13,
        end: 8,
        minimumSpeedMultiplier: -1
      },
      startRotation: {
        min: 0,
        max: 180
      },
      scale: {
        start: 1,
        end: 0,
        minimumScaleMultiplier: 0.5
      },
      color: {
        start: 'F2FDFF',
        end: '073E48'
      },
      lifetime: {
        min: 0.3,
        max: 0.4
      },
      blendMode: 'normal',
      frequency: 0.005,
      emitterLifetime: -1,
      maxParticles: 450,
      spawnType: 'point'
    });
  }

  onTick(_delta: number) {
    const centerX = this.sprite.x;
    const centerY = this.sprite.y;

    this.emitter.updateSpawnPos(centerX, centerY);
  }
}
