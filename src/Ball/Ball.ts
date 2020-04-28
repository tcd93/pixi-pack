import { GameObject } from '../app/GameObject';
import { Graphics, Application, Point, Sprite } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';
import { Materialized } from '../physics/Materialized';
import { IConvertable } from '../app/IConvertable';
import { debugRect } from '../common/common';

type BallAttributes = {
  /** unique identifier for objects */
  name: string,
  x: number,
  y: number
}

export class Ball extends Materialized(GameObject) implements IGraphics, IConvertable 
{  
  constructor(private app: Application, public attributes: BallAttributes) 
  {
    super(app, { name: attributes.name, payload: attributes, hitBoxShape: 'rect' });
    this.movementSpeed = 0.05;
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
    // Apply "friction"
    this.acceleration.set(this.acceleration.x * 0.99, this.acceleration.y * 0.99);

    if (mouseCoords.x > 0 || mouseCoords.y > 0) {
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
      this.acceleration.set(
        Math.cos(angleToMouse) * speed,
        Math.sin(angleToMouse) * speed
      );
    }
    this.sprite.x += this.acceleration.x * _delta;
    this.sprite.y += this.acceleration.y * _delta;
  }
}

// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1: Point, p2: Point) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.hypot(a, b);
}