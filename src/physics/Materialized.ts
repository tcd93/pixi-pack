import { Point, Sprite, Ticker } from 'pixi.js';
import { Global } from '../Global';
import { hit } from './bump';

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
    private physicTicker = new Ticker();

    constructor(...args: any[]) {
      super(...args);
      if (!('name' in {...args}[1])) {
        throw new Error('name argument is required in the GameObject parameter');
      }
      if (!('hitBoxShape' in {...args}[1])) {
        throw new Error('hitBoxShape must be defined in the GameObject parameter if using with Materialized');
      }

      const name = {...args}[1]['name'];
      this.hitBoxShape = {...args}[1]['hitBoxShape'];
      Global.emitter.once(name, this.onSpriteLoaded.bind(this));
      // create a separate ticker for handling physics related stuff
      this.physicTicker.autoStart = true;
      this.physicTicker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: Sprite) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      // add `hitBoxShape` prop to Sprite for bump.js to process
      this.sprite = Object.assign(sprite, { hitBoxShape: this.hitBoxShape });
      Global.physicsSprites.push(sprite);
    }

    private physicsUpdate(_delta: number): void {
      for (let i = 0; i < Global.physicsSprites.length; i++) {
        for (let j = i + 1; j < Global.physicsSprites.length; j++) {
          const currentSprite = Global.physicsSprites[i];
          const nextSprite = Global.physicsSprites[j]; // test against this sprite
          if (hit(currentSprite, nextSprite)) {
            console.log(`Impact between ${currentSprite.name} and ${nextSprite.name}`);
          }
        }
      }
    }
  }

  return RigidBody;
}