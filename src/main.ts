import { PingPongContainer } from "./app/app";
import './main.css';
import { Bomberman } from "./BomberMan/Bomberman";

/*TODO: css is just too fucking shit at centering things*/
document.body.className = 'centered-wrapper';
const canvas = document.getElementById('canvas')
canvas.className = 'centered-content'

// Pingpong container is the drawing area
// this includes one bomberman game object
new PingPongContainer({
  canvas: canvas,
  width: window.outerWidth / 2.75,
  height: window.outerHeight,
  builder: stage => new Bomberman(stage)
});
