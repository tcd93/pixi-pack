import { PingPongContainer } from './app/app'
import { Ball } from './game-objects/Ball/Ball'
import { Background } from './game-objects/Background/Background'
import { physics } from './physics/ticker'
import { Paddle } from './game-objects/Paddle/Paddle'

import { defaultLayout } from './config'

// CSS sections
import './main.scss'


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement

const debugCanvas = document.querySelector('#canvas-container > #debug') as HTMLCanvasElement
physics.debug(debugCanvas)

new PingPongContainer({
  view: canvasElement,
  builder: (app, { topId, bottomId }) => [
    new Background(app),
    new Ball({
      app: app,
      name: 'ball',
      onCollisionCallback: other => {
        if (other.id === topId) console.log('player win!')
        if (other.id === bottomId) console.log('bot win!')
      }
    }),
    new Paddle({
      app: app,
      name: 'paddle-top',
    }),
    new Paddle({
      app: app,
      name: 'paddle-bottom',
      y: defaultLayout.container.height - defaultLayout.paddle.height / 2, // pivot point of object is center
    }),
  ]
})