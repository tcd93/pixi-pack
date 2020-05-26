// Import 3d party libraries
import { PingPongContainer } from './app/app';
import { Interactable } from './app/Interactable';

// Import local
import { Ball } from './game-objects/Ball/Ball';
import { Paddle } from './game-objects/Paddle/Paddle';
import * as settings from './config.json';

// CSS sections
import './main.scss';
import { Background } from './game-objects/Background/Background';
import { Physics } from './physics/ticker';


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement
const physics = new Physics(canvasElement);

const debugCanvas = document.querySelector('#canvas-container > #debug') as HTMLCanvasElement
physics.debug(debugCanvas);

physics.addWalls();

// Pingpong container is the drawing area
// this includes an array of bomberman game object
// only the "left" & "front" bombermen are interactable
new PingPongContainer({
  view: canvasElement,
  width: settings.container.width,
  height: settings.container.height,
  builder: app => [
    new Background(app),
    new (Interactable(Ball))(app, {
      name: 'ball',
      x: settings.container.width / 2,
      y: settings.container.height / 2,
      friction: 0.0,
      frictionAir: 0.0,
      frictionStatic: 0.0,
      inertia: Infinity, //ball does not lose inertia after being hit
      restitution: 0.9, //add bouncing effect after hitting paddle (dampen force)
      radius: 5,
      hitBoxShape: 'circle',
      physics,
    }),
    new Paddle(app, {
      name: 'paddle-top',
      x: 10 + settings.paddle.width / 2,
      y: 3 + settings.paddle.height / 2,
      width: settings.paddle.width,
      height: settings.paddle.height,
      isStatic: true,
      hitBoxShape: 'rect',
      physics,
    }),
    new (Interactable(Paddle))(app, {
      name: 'paddle-bottom',
      x: 10 + settings.paddle.width / 2,
      y: -3 + settings.container.height - settings.paddle.height / 2,
      width: settings.paddle.width,
      height: settings.paddle.height,
      forceMultiplier: 1.3,
      // isStatic: true, //affected by physics
      friction: 0.0, //makes the paddle slides
      frictionStatic: 1.0,
      density: 0.0015, //"weight"
      hitBoxShape: 'rect',
      physics
    }),
  ]
});
