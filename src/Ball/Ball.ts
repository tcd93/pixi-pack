import { GameObject } from '../app/GameObject';
import { Graphics, Application } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';

export class Ball extends GameObject implements IGraphics {
  private graphics: Graphics;
  
  constructor(app: Application) {
    super({ app });
  }

  requireGraphics(): Graphics {
    this.graphics = new Graphics();
    this.graphics.beginFill(0xFF3300);
    this.graphics.drawCircle(250, 250, 25);
    this.graphics.endFill();
    return this.graphics;
  }

  update(): void {
    if (this.graphics)
      this.graphics.x += 0.5;
  }
}