import { Ticker } from 'pixi.js'
import * as Matter from 'matter-js'
import { Engine, Render } from 'matter-js'
import { defaultLayout } from '../../game_config'

class Physics {
  ticker: Ticker

  engine: Engine

  constructor() {
    this.ticker = new Ticker()
    this.ticker.maxFPS = 60.0
    this.engine = Engine.create()

    // disable gravity
    this.engine.world.gravity.y = 0
    this.engine.world.gravity.x = 0

    //@ts-expect-error magic: https://stackoverflow.com/questions/45224130/body-not-respecting-the-law-of-reflection-at-lower-speeds
    Matter.Resolver._restingThresh = 0.01
  }

  debug(canvas: HTMLCanvasElement) {
    const renderer = Render.create({
      engine: undefined,
      canvas,
      options: {
        wireframes: true,
        background: '#fafafa',
        width: defaultLayout.container.width,
        height: defaultLayout.container.height
      }
    })
    //@ts-expect-error magic to avoid "maximum callstack overflow" error
    renderer.engine = this.engine
    Render.run(renderer)
  }
}

/**
 * A global singleton for all physics objects, so that they can interact
 * with each other
 * 
 * Physic bodies' default pivot point is center (0.5, 0.5)
 */
export const physics = new Physics()