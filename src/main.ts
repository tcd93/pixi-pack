import {GameApp} from "./app/app";
import './main.scss';


const canvas = document.getElementById('canvas')

new GameApp({
  canvas: canvas,
  width: 600,
  height: 600
});
