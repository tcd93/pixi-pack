// Import 3d party libraries
import { PingPongContainer } from './app/app';

// Import local
import { Bomberman } from './BomberMan/Bomberman';
import { Ball } from './Ball/Ball';

// CSS sections
import './main.scss';


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement


// Pingpong container is the drawing area
// this includes an array of bomberman game object
new PingPongContainer({
  view: canvasElement,
  width: 600,
  height: 600,
  builder: app => [
    new Bomberman(app, {
      animationSpeed: 0.5,
      currentDirection: 'front',
      x: 300,
      y: 500
    }),
    new Bomberman(app, { 
      animationSpeed: 0.1,
      currentDirection: 'front',
      x: 450,
      y: 200
    }),
    new Ball(app)
  ]
});
