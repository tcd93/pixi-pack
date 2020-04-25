import { GameObject } from '../app/GameObject';
import { Graphics, Container } from 'pixi.js';
import { IGraphics } from '../app/IGraphics';

export class Ball extends GameObject implements IGraphics {
  constructor(stage: Container) {
    super({ stage });
  }

  requireGraphics(): Graphics {
    const graphics = new Graphics();
    graphics.beginFill(0xFF3300);
    graphics.drawCircle(250, 250, 25);
    graphics.endFill();
    return graphics;
  }
}