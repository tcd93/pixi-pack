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
        start: 1,
        end: 0.1
      },
      speed: {
        start: 20,
        end: 20,
        minimumSpeedMultiplier: -1
      },
      scale: {
        start: 1,
        end: 0,
        minimumScaleMultiplier: 0.5
      },
      color: {
        start: 'F0FCFF',
        end: '85E7FF'
      },
      lifetime: {
        min: 0.3,
        max: 1
      },  
      blendMode: 'normal',
      frequency: 0.003,
      emitterLifetime: -1,
      maxParticles: 300,
      spawnType: 'point',
    });
  }

  onTick(_delta: number) {
    const centerX = this.sprite.x + this.sprite.width / 2;
    const centerY = this.sprite.y + this.sprite.height / 2;
              
    this.emitter.updateSpawnPos(centerX, centerY);
  }
}