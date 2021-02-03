import { PingPongContainer } from './app/app'
import { Ball } from './game-objects/Ball/Ball'
import { Background } from './game-objects/Background/Background'
import { Physics } from './physics/ticker'
import { Paddle } from './game-objects/Paddle/Paddle'

import { defaultLayout, ballBody, paddleBody } from './config'

// CSS sections
import './main.scss'


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement
const physics = new Physics()

const debugCanvas = document.querySelector('#canvas-container > #debug') as HTMLCanvasElement
physics.debug(debugCanvas)

// Pingpong container is the drawing area
// this includes an array of bomberman game object
// only the "left" & "front" bombermen are interactable
new PingPongContainer({
  physics,
  view: canvasElement,
  width: defaultLayout.container.width,
  height: defaultLayout.container.height,
  builder: (app, { topId, bottomId }) => [
    new Background(app),
    new Ball({
      app: app,
      attributes: {
        name: 'ball',
        x: defaultLayout.container.width / 2,
        y: defaultLayout.container.height / 2,
        radius: 5,
        hitBoxShape: 'circle',
        physics,
        ...ballBody,
      },
      onCollisionCallback: other => {
        if (other.id === topId) {
          console.log('player win!')
        }
        if (other.id === bottomId) {
          console.log('bot win!')
        }
      }
    }),
    new Paddle({
      app: app,
      attributes: {
        name: 'paddle-top',
        x: 10 + defaultLayout.paddle.width / 2,
        y: 3 + defaultLayout.paddle.height / 2,
        width: defaultLayout.paddle.width,
        height: defaultLayout.paddle.height,
        ...paddleBody,
        hitBoxShape: 'rect',
        physics,
      }
    }),
    new Paddle({
      app: app, 
      attributes: {
        name: 'paddle-bottom',
        x: 10 + defaultLayout.paddle.width / 2,
        y: -3 + defaultLayout.container.height - defaultLayout.paddle.height / 2,
        width: defaultLayout.paddle.width,
        height: defaultLayout.paddle.height,
        ...paddleBody,
        hitBoxShape: 'rect',
        physics
      }
    }),
  ]
})