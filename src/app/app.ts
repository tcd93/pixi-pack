import { Application, Container } from 'pixi.js';
import { GameObject } from '../GameObject';

type ContainerParameter = {
  canvas: HTMLElement,
  width?: number,
  height?: number,
  builder: (stage: Container) => GameObject
}

export class PingPongContainer {

  constructor(parameter: ContainerParameter) {
    const app = new Application({ 
      width: parameter.width, 
      height: parameter.height, 
      backgroundColor: 0x000000 
    });
    parameter.canvas.appendChild(app.view);
    parameter.builder(app.stage)
  }
}