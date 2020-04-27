import { GameObject } from '../app/GameObject';
import { Graphics, Application, Point, Sprite } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';
import { Materialize } from '../app/Materialize';
import { IConvertable } from '../app/IConvertable';

export class Ball extends Materialize(GameObject) implements IGraphics, IConvertable {  
  private sprite: Sprite;

  constructor(private app: Application) 
  {
    super({ app });
    this.movementSpeed = 0.05;
  }

  requireGraphics(): Graphics {
    //draw a circle
    const graphics = new Graphics();
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(3, 0x33FFD7, 0.8);
    graphics.drawCircle(200, 200, 30);
    graphics.endFill();
    return graphics;
  }

  postConversion(sprite: Sprite): void {
    this.sprite = sprite;
    this.sprite.x = 300;
    this.sprite.y = 300;
  }

  update(_delta: number): void {
    const mouseCoords = this.app.renderer.plugins.interaction.mouse.global;
    // Apply "friction"
    this.acceleration.set(this.acceleration.x * 0.99, this.acceleration.y * 0.99);

    if (mouseCoords.x > 0 || mouseCoords.y > 0) {
      // Get the red circle's center point
      const position = new Point(
        this.sprite.x + (this.sprite.width * 0.5),
        this.sprite.y + (this.sprite.height * 0.5),
      );
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