import { World, Bodies, Engine, IBodyDefinition, Body, Events } from 'matter-js'
import { Sprite } from 'pixi.js'

import { physics } from './ticker'
import { GameObject } from '../app/GameObject'

// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T

export type UserDefinedPhysics = IBodyDefinition & {
  /**@default circle */
  hitBoxShape?: 'rect' | 'circle'
}

interface Materializable {
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
    onSpriteLoaded(sprite: Sprite, options?: UserDefinedPhysics) {
      sprite.anchor.set(0.5) //set to center to match matter.js

      if (!options) return

      const physicsBody = options.hitBoxShape === 'rect' ?
        Bodies.rectangle(sprite.x, sprite.y, sprite.width, sprite.height, options)
        : Bodies.circle(sprite.x, sprite.y, sprite.height / 2, options)

      World.addBody(
        physics.engine.world,
        physicsBody
      )

      Events.on(physics.engine, 'collisionEnd', event => {
        const pairs = event.pairs[0]
        let other: Body
        if (physicsBody === pairs.bodyB) {
          other = pairs.bodyA
        } else if (physicsBody === pairs.bodyA) {
          other = pairs.bodyB
        }
        if (other) {
          this.onCollision(other)
        }
      })
      this.onLoad(physicsBody)

      // create a separate ticker for handling physics related stuff
      // this ticker is run after the main app ticker
      physics.ticker.add(this.physicsUpdate.bind(this, physics.engine, sprite, physicsBody))
      if (!physics.ticker.started) physics.ticker.start()
    }

    private physicsUpdate(engine: Engine, sprite: Sprite, physicsBody: Body, _delta: number): void {
      Engine.update(engine, _delta)

      if (!sprite || !physicsBody) return

      // render the sprite based on body
      sprite.x = physicsBody.position.x
      sprite.y = physicsBody.position.y
      sprite.rotation = physicsBody.angle

      //delegate other physics/movement handling to users
      this.fixedUpdate(_delta)
    }

    protected onCollision(_other: Body): void { }

    /**
     * called once before `fixedUpdate` ticks start
     */
    protected onLoad(_physicsBody: Body): void { }

    protected fixedUpdate(_delta: number): void { }
  }
}