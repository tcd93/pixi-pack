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
  constructor({ width, height, builder, view, antialias = true }: ContainerParameter) {
    const app = new Application({ 
      width,
      height,
      view,
      backgroundColor: CONTAINER_BG_COLOR,
      antialias
    });
    
    builder(app)
  }
}