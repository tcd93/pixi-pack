import { Container } from '@game/app/app'
import { Ball, Background, Paddle } from '@game/game-objects'

import { defaultLayout } from './game_config'

import { bridge } from './bridge'

export function startOn(canvas: HTMLCanvasElement, debugCanvas?: HTMLCanvasElement): void {
  new Container({
    view: canvas,
    debugView: debugCanvas,
    builder: (app, { topId, bottomId }) => [
      new Background(app),
      new Ball({
        app,
        name: 'ball',
        onCollisionCallback: other => {
          if (other.id === topId) bridge.emit('game:add-score:player')
          if (other.id === bottomId) bridge.emit('game:add-score:bot')
        }
      }),
      new Paddle({
        app,
        name: 'paddle-top',
      }),
      new Paddle({
        app,
        name: 'paddle-bottom',
        y: defaultLayout.container.height - defaultLayout.paddle.height / 2, // pivot point of object is center
      }),
      // adding new game object into the view by inserting to the array
      // new Bomberman({
      //   app,
      //   name: 'bomberman'
      // })
    ]
  })
}