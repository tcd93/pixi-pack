// Import 3d party libraries
import { PingPongContainer } from './app/app';
import { Interactable } from './app/Interactable';

// Import local
import { Ball } from './game-objects/Ball/Ball';
import { Paddle } from './game-objects/Paddle/Paddle';

// CSS sections
import './main.scss';
import { Background } from './game-objects/Background/Background';


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement

export const CONTAINER = {
  width: 300,
  height: 550,
}

// Pingpong container is the drawing area
// this includes an array of bomberman game object
// only the "left" & "front" bombermen are interactable
new PingPongContainer({
  view: canvasElement,
  width: CONTAINER.width,
  height: CONTAINER.height,
  builder: app => [
    new Background(app),
    new Ball(app, {
      name: 'ball',
      x: CONTAINER.width / 2,
      y: CONTAINER.height / 2,
      movementSpeed: 0.025,
      friction: 0.0,
      radius: 7,
      hitBoxShape: 'circle',
      bounce: true,
    }),
    new Paddle(app, {
      name: 'paddle-top',
      x: 10,
      y: 10,
      width: 100,
      height: 10,
      movementSpeed: 0.275,
      friction: 0.015,
      hitBoxShape: 'rect',
      bounce: true,
    }),
    new (Interactable(Paddle))(app, {
      name: 'paddle-bot',
      x: 10,
      y: CONTAINER.height - 10 - 10,
      width: 100,
      height: 10,
      movementSpeed: 0.275,
      friction: 0.015,
      hitBoxShape: 'rect',
      bounce: true,
    }),
  ]
});
