import {
  GameObject,
  GameObjectParameter
} from '../../app/GameObject';
import {
  Graphics,
  Application,
  Sprite
} from 'pixi.js';
import {
  IGraphics
} from '../../app/IGraphics';
import {
  IConvertable
} from '../../app/IConvertable';
import {
  Materialized
} from '../../physics/Materialized';
import {
  Body
} from 'matter-js';

type PaddleAttributes = {
  x: number,
  y: number,
  /** the movement speed of paddle */
  forceMultiplier?: number,
  width: number,
  height: number,
} & GameObjectParameter

export class Paddle extends Materialized(GameObject) implements IGraphics, IConvertable {
  [x: string]: any;
  private isLeftPressed: boolean;
  private isRightPressed: boolean;
  private forceMultiplier: number;

  constructor(app: Application, attributes: PaddleAttributes) {
    super(app, attributes);

    this.forceMultiplier = attributes.forceMultiplier || 1;

    if (this.key && typeof this.key === 'function') {
      this.key('ArrowLeft').onPress = () => this.isLeftPressed = true;
      this.key('ArrowLeft').onRelease = () => this.isLeftPressed = false;
      this.key('ArrowRight').onPress = () => this.isRightPressed = true;
      this.key('ArrowRight').onRelease = () => this.isRightPressed = false;
    }
  }

  /* executed during construction */
  requireGraphics(payload: any): Graphics {
    return new Graphics()
      .beginFill(0xF7F7F7)
      .lineStyle(3, 0xF7F7F7, 0.8)
      .drawRect(0, 0, payload.width, payload.height)
      .endFill();
  }

  /* executed during construction */
  postConversion(sprite: Sprite, payload: any): void {
    sprite.x = payload.x;
    sprite.y = payload.y;
  }

  fixedUpdate(_delta: number) {
    if (this.isLeftPressed) {
      Body.applyForce(this.physicsBody, {
        x: this.physicsBody.position.x + this.sprite.width / 2, // apply force from the right edge
        y: this.physicsBody.position.y
      }, {
        x: -1 * _delta * this.forceMultiplier,
        y: 0,
      });
    }
    if (this.isRightPressed) {
      Body.applyForce(this.physicsBody, {
        x: this.physicsBody.position.x - this.sprite.width / 2, // apply force from the left edge
        y: this.physicsBody.position.y
      }, {
        x: _delta * this.forceMultiplier,
        y: 0,
      });
    }
  }
}
