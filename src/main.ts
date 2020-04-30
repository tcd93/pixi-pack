// Import 3d party libraries
import { PingPongContainer } from './app/app';

// Import local
import { Bomberman } from './BomberMan/Bomberman';
import { Ball } from './Ball/Ball';

// CSS sections
import './main.scss';
import { Materialized } from './physics/Materialized';


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
    new (Materialized(Bomberman))(app, {
      name: 'bomberman-front',
      animationSpeed: 0.5,
      currentDirection: 'front',
      x: 300,
      y: 400,
      hitBoxShape: 'rect',
      bounce: true,
    }),
    new (Materialized(Bomberman))(app, { 
      name: 'bomberman-left',
      animationSpeed: 0.5,
      currentDirection: 'left',
      x: 400,
      y: 100,
      hitBoxShape: 'rect',
      bounce: true,
    }),
    new Bomberman(app, { 
      name: 'bomberman-back',
      animationSpeed: 0.3,
      currentDirection: 'back',
      x: 100,
      y: 100,
      hitBoxShape: 'rect',
      bounce: true,
    }),
    new Ball(app, {
      name: 'ball',
      x: 300,
      y: 200,
      hitBoxShape: 'circle',
      bounce: true,
    })
  ]
});
