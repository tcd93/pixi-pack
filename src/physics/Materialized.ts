import { Sprite } from 'pixi.js';
import { Global } from '../Global';
import { hit, contain } from './bump';
import { Physics } from './ticker';
import { CONTAINER } from '../main';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

//can't directly add property to object like JS, have to explicitly difine a type
export type SpriteExt = Sprite & { hitBoxShape: string, vx?: number, vy?: number };

export type RigidBody = {
  /**the amount in % for the object to slowdown after each tick */
  friction?: number;
  /**flat movement speed */
  movementSpeed?: number;
  /**acceleration vector X for sprite direction*/
  vx?: number;
  /**acceleration vector Y for sprite direction*/
  vy?: number;
  /**if this object is bounded inside a container */
  isContained?: boolean;
  /**the mass of the object */
  mass?: number;
  /**currently only support 'rect' for hitbox detection */
  hitBoxShape?: 'rect' | 'circle';
} 

//note: vx, vy must be named like so, the library bump.js use this name
interface IMaterializable extends RigidBody {
  sprite: SpriteExt;
}

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized < T extends Constructor > (Base: T) {
  return class extends Base implements IMaterializable {
    vx: number; vy: number;
    friction: number;
    movementSpeed: number;
    hitBoxShape: 'rect' | 'circle';
    sprite: SpriteExt;
    isContained: boolean;

    constructor(...args: any[]) {
      super(...args);

      if (!('name' in {...args}[1])) {
        throw new Error('name argument is required in the GameObject parameter');
      }

      if (!('hitBoxShape' in {...args}[1])) {
        throw new Error('hitBoxShape must be defined in the GameObject parameter if using with Materialized');
      }

      let name: string;
      ({ hitBoxShape: this.hitBoxShape, name, isContained: this.isContained = true } 
        = {...args}[1]);
      Global.emitter.once(name, this.onSpriteLoaded.bind(this));

      // create a separate ticker for handling physics related stuff
      Physics.ticker.add(this.physicsUpdate.bind(this));
      console.log('physics update')
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
      if (!this.sprite) return;

      for (let i = 0; i < Physics.sprites.length; i++) {
        const nextSprite = Physics.sprites[i]; 
        if (this.sprite !== nextSprite ) {
          //BUG: collision bounce only happens on top?
          const collision = hit(this.sprite, nextSprite, true);
          if (collision) {
            console.log(`${this.sprite.name} collided with ${nextSprite.name} on ${collision} side`);

            setTimeout(() => Physics.ticker.destroy(), 500);
          }
        }
      }

      if (this.isContained) {
        contain(
          this.sprite, 
          { x: 0, y: 0, width: CONTAINER.width, height: CONTAINER.height }, 
          true
        );
      }
    }
  }
}