// Import 3d party libraries
import { PingPongContainer } from "./app/app";

// Import local
import { Bomberman } from "./BomberMan/Bomberman";

// CSS sections
import './main.scss';


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement


// Pingpong container is the drawing area
// this includes one bomberman game object
new PingPongContainer({
  view: canvasElement,
  width: 600,
  height: 600,
  builder: stage => new Bomberman(stage)
});
