import { IBodyDefinition, Bodies, World } from 'matter-js'

import { PingPongContainer } from './app/app'
import { Ball } from './game-objects/Ball/Ball'
import { Background } from './game-objects/Background/Background'
import { Physics } from './physics/ticker'
import { Paddle } from './game-objects/Paddle/Paddle'

import { defaultLayout, ballBody, paddleBody } from './config'

// CSS sections
import './main.scss'


const canvasElement = document.querySelector('#canvas-container > #ping-pong') as HTMLCanvasElement
const physics = new Physics(canvasElement)

const debugCanvas = document.querySelector('#canvas-container > #debug') as HTMLCanvasElement
physics.debug(debugCanvas)
const [topId, , bottomId, ,] = addWalls(physics.engine.world)

// Pingpong container is the drawing area
// this includes an array of bomberman game object
// only the "left" & "front" bombermen are interactable
new PingPongContainer({
  view: canvasElement,
  width: defaultLayout.container.width,
  height: defaultLayout.container.height,
  builder: app => [
    new Background(app),
    new Ball(
      app,
      {
        name: 'ball',
        x: defaultLayout.container.width / 2,
        y: defaultLayout.container.height / 2,
        radius: 5,
        hitBoxShape: 'circle',
        physics,
        ...ballBody,
      },
      other => {
        if (other.id === topId) {
          console.log('player win!')
        }
        if (other.id === bottomId) {
          console.log('bot win!')
        }
      }
    ),
    new Paddle(app, {
      name: 'paddle-top',
      x: 10 + defaultLayout.paddle.width / 2,
      y: 3 + defaultLayout.paddle.height / 2,
      width: defaultLayout.paddle.width,
      height: defaultLayout.paddle.height,
      ...paddleBody,
      hitBoxShape: 'rect',
      physics,
    }),
    new Paddle(app, {
      name: 'paddle-bottom',
      x: 10 + defaultLayout.paddle.width / 2,
      y: -3 + defaultLayout.container.height - defaultLayout.paddle.height / 2,
      width: defaultLayout.paddle.width,
      height: defaultLayout.paddle.height,
      ...paddleBody,
      hitBoxShape: 'rect',
      physics
    }),
  ]
})


/**
 * add walls around the container (top & bottom: sensor; left & right: static)
 */
function addWalls(world: World) {
  const option: IBodyDefinition = {
    isStatic: true,
    restitution: 1.0, //objects bounce on this
    render: {
      visible: true
    }
  }
  // walls
  const bottom =
    Bodies.rectangle(
      defaultLayout.container.width / 2, // center
      defaultLayout.container.height,    // bottom
      defaultLayout.container.width, 
      defaultLayout.paddle.height, 
      option,
    )
  const right =
    Bodies.rectangle(
      defaultLayout.container.width, 
      defaultLayout.container.height / 2, 
      defaultLayout.paddle.height, 
      defaultLayout.container.height, 
      option
    )
  const top =
    Bodies.rectangle(
      defaultLayout.container.width / 2, 
      0, 
      defaultLayout.container.width, 
      defaultLayout.paddle.height, 
      option
    )
  const left =
    Bodies.rectangle(
      0, 
      defaultLayout.container.height / 2, 
      defaultLayout.paddle.height, 
      defaultLayout.container.height, 
      option
    )

  World.add(world, [
    top, right, bottom, left
  ])

  return [top.id, right.id, bottom.id, left.id]
}
