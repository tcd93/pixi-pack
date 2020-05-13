import {
  Ticker
} from 'pixi.js';
import {
  Engine,
  World,
  Bodies,
  Render,
  IBodyDefinition,
} from 'matter-js';
import * as settings from '../config.json';
import Matter = require('matter-js');

/**A global class for all physics objects, so that they can interact
 * with each other
 * 
 * Physic bodies' default pivot point is center (0.5, 0.5)
 * */
export class Physics {
  ticker: Ticker;

  engine: Engine;

  constructor(canvas: HTMLElement) {
    this.ticker = new Ticker();
    this.engine = Engine.create(canvas);
    console.debug('initializing physics engine...');

    // disable gravity
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.x = 0;

    // another magic: https://stackoverflow.com/questions/45224130/body-not-respecting-the-law-of-reflection-at-lower-speeds
    //@ts-ignore
    Matter.Resolver._restingThresh = 0.01;
  }

  debug(canvas: HTMLCanvasElement) {
    const renderer = Render.create({
      engine: undefined,
      canvas,
      options: {
        wireframes: true,
        background: '#fafafa',
        width: settings.container.width,
        height: settings.container.height
      }
    });
    // a magic to avoid "maximum callstack overflow" error
    //@ts-ignore
    renderer.engine = this.engine;
    Render.run(renderer);
  }

  addWalls() {
    const option: IBodyDefinition = {
      isStatic: true,
      restitution: 0.975, //objects bounce on this
      render: {
        visible: true
      }
    };
    // walls
    const bottom = Bodies.rectangle(settings.container.width / 2, settings.container.height, settings.container.width, settings.paddle.height, option);
    const right = Bodies.rectangle(settings.container.width, settings.container.height / 2, settings.paddle.height, settings.container.height, option);
    const top = Bodies.rectangle(settings.container.width / 2, 0, settings.container.width, settings.paddle.height, option);
    const left = Bodies.rectangle(0, settings.container.height / 2, settings.paddle.height, settings.container.height, option);

    World.add(this.engine.world, [
      top, right, bottom, left
    ]);
  }
}
