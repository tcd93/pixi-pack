import { Sprite } from 'pixi.js';
import { Global } from '../Global';
import { hit, contain } from './bump';
import { Physics } from './ticker';
import { CONTAINER } from '../main';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

//can't directly add property to object like JS, have to explicitly difine a type
export type SpriteExt = Sprite & { 
  vx?: number, 
  vy?: number,
  mass?: number,
  circular?: boolean
};

export type RigidBody = {
  /**the amount in % for the object to slowdown after each tick */
  friction?: number;
  /**flat movement speed */
  movementSpeed?: number;
  /**objects can bounce on this?, default true */
  bounce?: boolean;
  /**acceleration vector X for sprite direction*/
  vx?: number;
  /**acceleration vector Y for sprite direction*/
  vy?: number;
  /**if this object is bounded inside a container, default: true */
  isContained?: boolean;
  /**the mass of the object, must be >= 1, default: 1 */
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
    bounce: boolean;
    mass: number;
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
      ({ 
        name, 
        hitBoxShape: this.hitBoxShape, 
        isContained: this.isContained = true,
        bounce: this.bounce = true,
        mass: this.mass = 1
      } = {...args}[1]);

      if (this.hitBoxShape != 'rect' && this.hitBoxShape != 'circle') {
        throw new Error('Invalid hitBoxShape property, must be "rect" or "circle');
      }
      if (this.mass < 1) {
        throw new Error('Invalid mass property, must be > 1');
      }

      Global.emitter.once(name, this.onSpriteLoaded.bind(this));

      // create a separate ticker for handling physics related stuff
      // this ticker is run after the main app ticker
      Physics.ticker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: SpriteExt) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      this.sprite = sprite;

      // add props to Sprite for bump.js to process
      this.sprite.mass = this.mass;
      this.sprite.circular = this.hitBoxShape == 'circle' ? true : false;

      Physics.sprites.push(this.sprite);

      if (!Physics.ticker.started) Physics.ticker.start();
    }

    private physicsUpdate(_delta: number): void {
      if (!this.sprite) return;

      //#region COLLISION DETECTION
      for (let i = 0; i < Physics.sprites.length; i++) {
        const nextSprite = Physics.sprites[i]; 
        if (this.sprite !== nextSprite ) {
          hit(this.sprite, nextSprite, this.bounce);
        }
      }
      //#endregion

      //#region CONTAIN
      if (this.isContained) {
        contain(
          this.sprite, 
          { x: 0, y: 0, width: CONTAINER.width, height: CONTAINER.height }, 
          true
        );
      }
      //#endregion
    }
  }
}