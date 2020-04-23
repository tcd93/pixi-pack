import { Application, Container } from 'pixi.js';
import { GameObject } from '../GameObject';

const CONTAINER_BG_COLOR = 0x000000

type ContainerParameter = {
  view: HTMLCanvasElement ,
  width?: number,
  height?: number,
  builder: (stage: Container) => GameObject
}

export class PingPongContainer {
  constructor({ width, height, builder, view }: ContainerParameter) {
    const app = new Application({ 
      width,
      height,
      view,
      backgroundColor: CONTAINER_BG_COLOR
    });

    builder(app.stage)
  }
}