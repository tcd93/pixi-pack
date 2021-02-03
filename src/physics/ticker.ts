import { Ticker } from 'pixi.js'
import { Engine, Render } from 'matter-js'
import Matter = require('matter-js')
import { defaultLayout } from '../config'

/**A global class for all physics objects, so that they can interact
 * with each other
 * 
 * Physic bodies' default pivot point is center (0.5, 0.5)
 * */
export class Physics {
  ticker: Ticker

  engine: Engine

  constructor(canvas: HTMLElement) {
    this.ticker = new Ticker()
    this.engine = Engine.create(canvas)
    console.debug('initializing physics engine...')

    // disable gravity
    this.engine.world.gravity.y = 0
    this.engine.world.gravity.x = 0

    // another magic: https://stackoverflow.com/questions/45224130/body-not-respecting-the-law-of-reflection-at-lower-speeds
    //@ts-ignore
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
    // a magic to avoid "maximum callstack overflow" error
    //@ts-ignore
    renderer.engine = this.engine
    Render.run(renderer)
  }
}
