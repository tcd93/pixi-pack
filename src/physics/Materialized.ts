import { Point, Sprite } from 'pixi.js';
import { Global } from '../Global';
import { hit } from './bump';
import { Physics } from './ticker';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

//can't directly add property to object like JS, have to explicitly difine a type
export type SpriteExt = Sprite & { hitBoxShape: string };

interface IMaterializable {
  /**the amount in % for the object to slowdown after each tick */
  friction: number;
  /**flat movement speed */
  movementSpeed: number;
  /**a property to hold the acceleration vector for calculations */
  acceleration: Point;

  sprite: SpriteExt;
  /**currently only support 'rect' for hitbox detection */
  hitBoxShape: 'rect' | 'circle';
}

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized < T extends Constructor > (Base: T) {
  return class extends Base implements IMaterializable {
    acceleration: Point;
    friction: number;
    movementSpeed: number;
    hitBoxShape: 'rect' | 'circle';
    sprite: SpriteExt;

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

    private onSpriteLoaded(sprite: SpriteExt) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      this.sprite = sprite;

      // add `hitBoxShape` prop to Sprite for bump.js to process
      this.sprite.hitBoxShape = this.hitBoxShape;

      Physics.sprites.push(this.sprite);

      if (!Physics.ticker.started) Physics.ticker.start();
    }

    private physicsUpdate(_delta: number): void {
      if (!this.acceleration) 
        this.acceleration = new Point(0);

      for (let i = 0; i < Physics.sprites.length; i++) {
        const nextSprite = Physics.sprites[i]; 
        if (this.sprite !== nextSprite ) {
          let collision = hit(this.sprite, nextSprite, true);
          if (collision) {
            console.log(`${this.sprite.name} collided with ${nextSprite.name} on ${collision} side`);
          }
        }
      }
    }
  }
}