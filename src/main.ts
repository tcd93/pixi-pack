import { PingPongContainer } from "./app/app";
import './main.scss';
import { Bomberman } from "./BomberMan/Bomberman";

const canvas = document.getElementById('canvas')

// Pingpong container is the drawing area
// this includes one bomberman game object
new PingPongContainer({
  canvas: canvas,
  width: 600,
  height: 600,
  builder: stage => new Bomberman(stage)
});
