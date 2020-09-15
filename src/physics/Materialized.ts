import { Sprite } from 'pixi.js';
import { Global } from '../Global';
import { Physics } from './ticker';
import { World, Bodies, Engine, IBodyDefinition, Body } from 'matter-js';
import { GameObjectParameter } from '../app/GameObject';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

export interface IPongBodyDefinition extends IBodyDefinition {
  /**currently only support 'rect' for hitbox detection */
  hitBoxShape?: 'rect' | 'circle';
  /**the unique name of sprite */
  name?: string;
  // global physics instance for all objects inside canvas
  physics?: Physics
} 

interface IMaterializable extends IPongBodyDefinition {
  // associated sprite (for render)
  sprite: Sprite;
  // associated physics body (for physics emulation - Matter.js)
  physicsBody: Matter.Body;
}

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized < T extends Constructor > (Base: T) {
  return class extends Base implements IMaterializable {
    name: string;
    sprite: Sprite;
    physicsBody: Matter.Body;
    physics: Physics;

    constructor(...args: any[]) {
      super(...args);
      const parameter: GameObjectParameter = args[1];

      if (!('physics' in parameter)) {
        throw new Error('physics instance is required in the GameObject parameter');
      }
      if (!('name' in parameter)) {
        throw new Error('name argument is required in the GameObject parameter');
      }
      if (!('hitBoxShape' in parameter)) {
        throw new Error('hitBoxShape must be defined in the GameObject parameter if using with Materialized');
      }

      let hitBoxShape;
      ({ 
        name: this.name, 
        hitBoxShape, 
        physics: this.physics
      } = parameter);

      if (hitBoxShape != 'rect' && hitBoxShape != 'circle') {
        throw new Error('Invalid hitBoxShape property, must be "rect" or "circle');
      }

      Global.emitter.once(this.name, (sprite: Sprite) => {
        this.onSpriteLoaded.call(this, sprite, parameter);
      });

      // create a separate ticker for handling physics related stuff
      // this ticker is run after the main app ticker
      this.physics.ticker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: Sprite, parameter: GameObjectParameter) {
      sprite.name = this.name;
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      this.sprite = sprite;
      this.sprite.anchor.set(0.5); //set to center to match matter.js

      this.physicsBody = parameter.hitBoxShape === 'rect' ?
        Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, parameter) 
        : Bodies.circle(sprite.x, sprite.y, sprite.height / 2, parameter);

      World.addBody(
        this.physics.engine.world, 
        this.physicsBody
      );

      this.beforeLoad(this.physics.engine, this.physicsBody);

      if (!this.physics.ticker.started) this.physics.ticker.start();
    }

    private physicsUpdate(_delta: number): void {
      Engine.update(this.physics.engine, _delta);

      if (!this.sprite || !this.physicsBody) return;

      // render the sprite based on body
      this.sprite.x = this.physicsBody.position.x;
      this.sprite.y = this.physicsBody.position.y;
      this.sprite.rotation = this.physicsBody.angle;

      //delegate other physics/movement handling to users
      this.fixedUpdate(_delta);
    }

    /**
     * called once before `fixedUpdate` ticks start
     */
    protected beforeLoad(_engine: Engine, _physicsBody: Body): void {}

    protected fixedUpdate(_delta: number): void {}
  }
}