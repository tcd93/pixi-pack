import { GameObject, GameObjectParameter } from '../../app/GameObject';
import { Graphics, Application, Sprite } from 'pixi.js';
import { IGraphics } from '../../app/IGraphics';
import { IConvertable } from '../../app/IConvertable';
import { Materialized } from '../../physics/Materialized';
import { Trail } from './Trail/Trail';
import { Body } from 'matter-js';

type BallAttributes = {
  x: number,
  y: number,
  radius: number,
} & GameObjectParameter

export class Ball extends Materialized(GameObject) implements IGraphics, IConvertable 
{
  [key: string]: any;
  private trail: Trail;
  private isGameStarted: Boolean;

  constructor(app: Application, attributes: BallAttributes) 
  {
    super(app, attributes);

    if (this.key && typeof this.key === 'function') {
      this.key(' ').onRelease = () => {
        if (this.physicsBody && !this.isGameStarted) {
          Body.applyForce(this.physicsBody, this.physicsBody.position,
            {
              //0.4 - 0.6
              x: Math.random() * 0.2 + 0.4,
              y: Math.random() * 0.2 + 0.4
            });

          this.isGameStarted = true;
        }
      };
    }
  }

  /* executed during construction */
  requireGraphics(payload: any): Graphics {
    //draw a circle
    return new Graphics()
      .beginFill(0xFFFFFF)
      .drawCircle(100, 100, payload.radius)
      .endFill();
  }

  /* executed during construction */
  postConversion(sprite: Sprite, payload: any): void {
    sprite.x = payload.x;
    sprite.y = payload.y;
  }

  update(_delta: number): void {
    if (!this.trail && this.sprite) {
      this.trail = new Trail(this.sprite);
    }
    if (this.trail) {
      this.trail.onTick(_delta);
    }
  }
}
