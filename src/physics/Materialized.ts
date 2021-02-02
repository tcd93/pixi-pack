import { World, Bodies, Engine, IBodyDefinition, Body } from 'matter-js'
import { Sprite } from 'pixi.js'

import { Physics } from './ticker'
import { GameObject } from '../app/GameObject'

// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T

export type UserDefinedPhysics = IBodyDefinition & {
  /**currently only support 'rect' for hitbox detection */
  hitBoxShape: 'rect' | 'circle'
  /**global physics instance for all objects inside canvas */
  physics: Physics
}

interface Materializable {
  /**associated physics body (for physics emulation - Matter.js) */
  physicsBody: Matter.Body
  /**associated sprite (for render) */
  sprite: Sprite
  /**
   * "Materializable" objects must use Sprite, this method is exposed
   * to get Sprite's info (such as x, y) to create matching Physics body in matterjs
   */
  onSpriteLoaded(sprite: Sprite, parameter: UserDefinedPhysics): void
}

export function isMaterialiazed(instance: Materializable | GameObject): instance is Materializable {
  return (
    (instance as Materializable).onSpriteLoaded !== undefined
  )
}

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialized<T extends Constructor>(Base: T) {
  return class extends Base implements Materializable {
    physicsBody: Matter.Body
    sprite: Sprite

    onSpriteLoaded(sprite: Sprite, options?: UserDefinedPhysics) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`)
      this.sprite = sprite
      this.sprite.anchor.set(0.5) //set to center to match matter.js

      if (!options) return

      this.physicsBody = options.hitBoxShape === 'rect' ?
        Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, options)
        : Bodies.circle(sprite.x, sprite.y, sprite.height / 2, options)

      World.addBody(
        options.physics.engine.world,
        this.physicsBody
      )

      this.beforeLoad(options.physics.engine, this.physicsBody)

      // create a separate ticker for handling physics related stuff
      // this ticker is run after the main app ticker
      options.physics.ticker.add(this.physicsUpdate.bind(this, options.physics.engine))
      if (!options.physics.ticker.started) options.physics.ticker.start()
    }

    private physicsUpdate(engine: Engine, _delta: number): void {
      Engine.update(engine, _delta)

      if (!this.sprite || !this.physicsBody) return

      // render the sprite based on body
      this.sprite.x = this.physicsBody.position.x
      this.sprite.y = this.physicsBody.position.y
      this.sprite.rotation = this.physicsBody.angle

      //delegate other physics/movement handling to users
      this.fixedUpdate(_delta)
    }

    /**
     * called once before `fixedUpdate` ticks start
     */
    protected beforeLoad(_engine: Engine, _physicsBody: Body): void { }

    protected fixedUpdate(_delta: number): void { }
  }
}