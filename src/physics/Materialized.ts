import { Point, Sprite } from 'pixi.js';
import { Global } from '../Global';
import { hit } from './bump';
import { Physics } from './ticker';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized < T extends Constructor > (Base: T) {
  class RigidBody extends Base {
    acceleration = new Point(0);
    movementSpeed = 0;
    sprite: Sprite;
    hitBoxShape: string;

    constructor(...args: any[]) {
      super(...args);

      if (!('name' in {...args}[1])) {
        throw new Error('name argument is required in the GameObject parameter');
      }

      if (!('hitBoxShape' in {...args}[1])) {
        throw new Error('hitBoxShape must be defined in the GameObject parameter if using with Materialized');
      }

      let name: string;
      ({ hitBoxShape: this.hitBoxShape, name } = {...args}[1]);
      Global.emitter.once(name, this.onSpriteLoaded.bind(this));

      // create a separate ticker for handling physics related stuff
      Physics.ticker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: Sprite) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      // add `hitBoxShape` prop to Sprite for bump.js to process
      this.sprite = Object.assign(sprite, { hitBoxShape: this.hitBoxShape });

      Physics.sprites.push(sprite);

      if (!Physics.ticker.started) Physics.ticker.start();
    }

    private physicsUpdate(_delta: number): void {
      for (let i = 0; i < Physics.sprites.length; i++) {
        const nextSprite = Physics.sprites[i]; 
        if (this.sprite !== nextSprite ) {
          let collision = hit(this.sprite, nextSprite, false);
          if (collision) {
            console.log(`${this.sprite.name} collided with ${nextSprite.name} on ${collision} side`);
          }
        }
      }
    }
  }

  return RigidBody;
}