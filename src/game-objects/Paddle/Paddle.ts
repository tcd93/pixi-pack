import { GameObject, GameObjectParameter } from '../../app/GameObject';
import { Graphics, Application, Sprite } from 'pixi.js';
import { IGraphics } from '../../app/IGraphics';
import { IConvertable } from '../../app/IConvertable';
import { Materialized } from '../../physics/Materialized';

type BallAttributes = {
  x: number,
  y: number,
  width: number,
  height: number,
} & GameObjectParameter

export class Paddle extends Materialized(GameObject) implements IGraphics, IConvertable
{
  [x: string]: any;
  private isLeftPressed: boolean;
  private isRightPressed: boolean;

  constructor(app: Application, attributes: BallAttributes) 
  {
    super(app, attributes);

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
    // if (this.isLeftPressed) {
    //   this.sprite.vx = ( this.sprite.vx || 1 ) - this.movementSpeed;
    // }
    // if (this.isRightPressed) {
    //   this.sprite.vx = ( this.sprite.vx || 1 ) + this.movementSpeed;
    // }

    // //#region MOVEMENT UPDATE
    // if (this.friction) {
    //   this.sprite.vx = (this.sprite.vx || 0) * (1 - this.friction), 
    //   this.sprite.vy = (this.sprite.vy || 0) * (1 - this.friction)
    // }
    // this.sprite.x += (this.sprite.vx || 0) * _delta;
    // this.sprite.y += (this.sprite.vy || 0) * _delta;
    // //#endregion
  }
}