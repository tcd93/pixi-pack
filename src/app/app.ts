import { Bodies, IBodyDefinition, World } from 'matter-js'
import { Application } from 'pixi.js'
import { GameObject } from './GameObject'
import { defaultLayout } from '../config'
import { Physics } from '../physics/ticker'

const CONTAINER_BG_COLOR = 0x000000

/**the body ids of surrounding wall - used for collision detection */
type Walls = {
  topId: number
  rightId: number
  leftId: number
  bottomId: number
}

type ContainerParameter = {
  physics: Physics,
  view: HTMLCanvasElement,
  width?: number,
  height?: number,
  antialias?: boolean,
  builder: (app: Application, walls: Walls) => GameObject[]
}

export class PingPongContainer {
  private app: Application

  constructor({ physics, width, height, builder, view, antialias = true }: ContainerParameter) {
    this.app = new Application({
      width,
      height,
      view,
      backgroundColor: CONTAINER_BG_COLOR,
      antialias
    })

    builder(this.app, addWalls(physics.engine.world))
  }
}


/**
 * add walls around the container (top & bottom: sensor; left & right: static)
 */
function addWalls(world: World): Walls {
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

  return {
    topId: top.id,
    rightId: right.id,
    leftId: left.id,
    bottomId: bottom.id,
  }
}
