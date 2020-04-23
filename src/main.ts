import {GameApp} from "./app/app";
import './main.scss';

/*TODO: css is just too fucking shit at centering things*/
document.body.className = 'centered-wrapper';
const canvas = document.getElementById('canvas')
canvas.className = 'centered-content'

new GameApp({
  canvas: canvas,
  width: window.outerWidth / 2.75,
  height: window.outerHeight
});
