// Import 3d party libraries
import { PingPongContainer } from './app/app';

// Import local
// import { Bomberman } from './BomberMan/Bomberman';
import { Ball } from './Ball/Ball';

// CSS sections
import './main.scss';
// import { Materialized } from './physics/Materialized';
import { Rect } from './Ball/Rect';
import { Interactable } from './app/Interactable';


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement

export const CONTAINER = {
  width: 600,
  height: 600,
}

// Pingpong container is the drawing area
// this includes an array of bomberman game object
// only the "left" & "front" bombermen are interactable
new PingPongContainer({
  view: canvasElement,
  width: CONTAINER.width,
  height: CONTAINER.height,
  builder: app => [
    new Ball(app, {
      name: 'ball',
      x: 300,
      y: 200,
      hitBoxShape: 'circle',
      bounce: true,
    }),
    new Rect(app, {
      name: 'bar-top',
      x: 10,
      y: 10,
      width: 125,
      height: 15,
      hitBoxShape: 'rect',
      bounce: true,
    }),
    new (Interactable(Rect))(app, {
      name: 'bar-bot',
      x: 10,
      y: 570,
      width: 125,
      height: 15,
      hitBoxShape: 'rect',
      bounce: true,
    }),
  ]
});
