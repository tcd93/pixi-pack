import { GameObject, GameObjectParameter } from '../app/GameObject';
import { Graphics, Application, Point, Sprite } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';
import { IConvertable } from '../app/IConvertable';
import { debugRect } from '../common/common';
import { Materialized } from '../physics/Materialized';

const MOUSE = {
  'none': -1,
  'leftClick': 0,
  'middleClick': 1,
  'rightClick': 2,
}

type BallAttributes = {
  x: number,
  y: number
} & GameObjectParameter

export class Ball extends Materialized(GameObject) implements IGraphics, IConvertable 
{
  constructor(private app: Application, public attributes: BallAttributes) 
  {
    super(app, { name: attributes.name, payload: attributes, hitBoxShape: 'rect' });
    this.movementSpeed = 0.09;
    // Apply "friction"
    this.friction = 0.01;
  }

  /* executed during construction */
  requireGraphics(): Graphics {
    //draw a circle
    return new Graphics()
      .beginFill(0xFF3300)
      .lineStyle(3, 0x33FFD7, 0.8)
      .drawCircle(200, 200, 30)
      .endFill();
  }

  /* executed during construction */
  postConversion(sprite: Sprite, payload: any): void {
    sprite.x = payload.x;
    sprite.y = payload.y;

    debugRect(sprite);
  }

  update(_delta: number): void {
    if (!this.sprite) return;

    const mouseCoords = this.app.renderer.plugins.interaction.mouse.global;
    const mouseButton = this.app.renderer.plugins.interaction.mouse.button;
    if (mouseButton === MOUSE.leftClick && (mouseCoords.x > 0 || mouseCoords.y > 0)) {
      // Get the red circle's global anchor point
      const gPoint = this.sprite.toGlobal(this.sprite.anchor);
      const position = new Point(gPoint.x, gPoint.y);
      // Calculate the direction vector between the mouse pointer and the red circle
      const toMouseDirection = new Point(
        mouseCoords.x - position.x,
        mouseCoords.y - position.y,
      );
      // Use the above to figure out the angle that direction has
      const angleToMouse = Math.atan2(toMouseDirection.y, toMouseDirection.x);
      // Figure out the speed the sprite should be travelling by, as a
      // function of how far away from the mouse pointer the red square is
      const distMouseSprite = distanceBetweenTwoPoints(mouseCoords, position);
      const speed = distMouseSprite * this.movementSpeed;
      // Calculate the acceleration of the red circle
      this.sprite.vx = Math.cos(angleToMouse) * speed;
      this.sprite.vy = Math.sin(angleToMouse) * speed;
    }

    if (this.friction) {
      this.sprite.vx = (this.sprite.vx ?? 0) * (1 - this.friction), 
      this.sprite.vy = (this.sprite.vy ?? 0) * (1 - this.friction)
    }

    this.sprite.x += (this.sprite.vx ?? 0) * _delta;
    this.sprite.y += (this.sprite.vy ?? 0) * _delta;
  }
}

// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1: Point, p2: Point) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.hypot(a, b);
}