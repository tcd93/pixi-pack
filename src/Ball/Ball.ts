import { GameObject } from '../app/GameObject';
import { Graphics, Application, Point, Sprite, SCALE_MODES } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';

export class Ball extends GameObject implements IGraphics {
  // How fast the red circle moves
  private movementSpeed = 0.01;
  private sprite: Sprite;
  
  constructor(private app: Application) {
    super({ app });
  }

  requireGraphics(app: Application): Sprite {
    //draw a circle
    const graphics = new Graphics();
    graphics.beginFill(0xFF3300);
    graphics.drawCircle(200, 200, 30);
    graphics.endFill();

    //create a sprite from the circle
    const renderTexture = app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 1);
    this.sprite = new Sprite(renderTexture);
    this.sprite.x = 300;
    this.sprite.y = 300;

    return this.sprite;
  }

  update(delta: number): void {
    const mouseCoords = this.app.renderer.plugins.interaction.mouse.global;
    // If the mouse is off screen, then don't update any further
    if (this.app.screen.width > mouseCoords.x && mouseCoords.x > 0
      || this.app.screen.height > mouseCoords.y && mouseCoords.y > 0) {
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
      this.sprite.x += Math.cos(angleToMouse) * speed * delta;
      this.sprite.y += Math.sin(angleToMouse) * speed * delta;
    }
  }
}

// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1: Point, p2: Point) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.hypot(a, b);
}