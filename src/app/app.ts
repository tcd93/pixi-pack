import { Application } from 'pixi.js';
import { GameObject } from './GameObject';

const CONTAINER_BG_COLOR = 0x000000

type ContainerParameter = {
  view: HTMLCanvasElement ,
  width?: number,
  height?: number,
  antialias?: boolean,
  builder: (app: Application) => GameObject[]
}

export class PingPongContainer {
  private app: Application;

  constructor({ width, height, builder, view, antialias = true }: ContainerParameter) {
    this.app = new Application({ 
      width,
      height,
      view,
      backgroundColor: CONTAINER_BG_COLOR,
      antialias
    });
    
    builder(this.app);

    this.app.ticker.add(this.update.bind(this));
  }

  private update(_delta: number) {
    this.app.stage.children.forEach(displayObject => {
      if (!this.app.screen.contains(
        displayObject.x, displayObject.y
      )) {
        console.log(`${displayObject.name} is out of bound!`);
      }
    })
  }
}