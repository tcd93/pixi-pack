import { Sprite } from 'pixi.js';
import { Global } from '../Global';
import { Physics } from './ticker';
import { World, Bodies, Engine, IBodyDefinition, Body } from 'matter-js';
import { GameObjectParameter } from '../app/GameObject';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

export interface Materializable extends IBodyDefinition {
  /**currently only support 'rect' for hitbox detection */
  hitBoxShape: 'rect' | 'circle';
  // global physics instance for all objects inside canvas
  physics: Physics
} 

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized < T extends Constructor > (Base: T) {
  return class extends Base implements Materializable {
    // associated sprite (for render)
    sprite: Sprite;
    // associated physics body (for physics emulation - Matter.js)
    physicsBody: Matter.Body;
    // sprite name
    name: string;
    
    physics: Physics;
    hitBoxShape: 'rect' | 'circle';

    constructor(...args: any[]) {
      super(...args);
      const parameter: GameObjectParameter & Materializable = args[1];

      ({ 
        name: this.name, 
        hitBoxShape: this.hitBoxShape, 
        physics: this.physics
      } = parameter);

      Global.emitter.once(this.name, (sprite: Sprite) => {
        this.onSpriteLoaded.call(this, sprite, parameter);
      });

      // create a separate ticker for handling physics related stuff
      // this ticker is run after the main app ticker
      this.physics.ticker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: Sprite, parameter: GameObjectParameter & Materializable) {
      sprite.name = this.name;
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      this.sprite = sprite;
      this.sprite.anchor.set(0.5); //set to center to match matter.js

      this.physicsBody = this.hitBoxShape === 'rect' ?
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