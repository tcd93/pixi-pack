import { GameObject, GameObjectParameter } from '../../app/GameObject'
import { Graphics, Application, Sprite } from 'pixi.js'
import { Shapeable } from '../../app/Shapeable'
import { Convertable } from '../../app/Convertable'
import { Materialized, UserDefinedPhysics } from '../../physics/Materialized'
import { Trail } from './Trail/Trail'
import { Body, Events, Engine, Vector } from 'matter-js'
import { Interactable } from '../../app/Interactable'

type BallAttributes = {
  x: number
  y: number
  radius: number
} & GameObjectParameter
  & UserDefinedPhysics

export class Ball extends Interactable(Materialized(GameObject)) implements Shapeable, Convertable {
  private trail: Trail
  private isGameStarted: Boolean

  constructor(app: Application, attributes: BallAttributes, private onCollisionCallback?: (other: Body) => void) {
    super(app, attributes)

    if (this.key && typeof this.key === 'function') {
      this.key(' ').onRelease = () => {
        if (this.physicsBody && !this.isGameStarted) {
          Body.setVelocity(this.physicsBody, Vector.rotate(
            {x: 1.5, y: 1.5},
            Math.random(),
          ))

          this.isGameStarted = true
        }
      }
    }
  }

  beforeLoad(engine: Engine, physicsBody: Body) {
    console.debug('--- registering events for ball ---')
    Events.on(engine, 'collisionEnd', event => {
      let pairs = event.pairs[0]
      let other: Body
      if (physicsBody === pairs.bodyB) {
        other = pairs.bodyA
      } else if (physicsBody === pairs.bodyA) {
        other = pairs.bodyB
      }

      if (other && this.onCollisionCallback) {
        this.onCollisionCallback(other)
      }
    })
  }

  requireGraphics(payload: BallAttributes): Graphics {
    //draw a circle
    return new Graphics()
      .beginFill(0xFFFFFF)
      .drawCircle(100, 100, payload.radius)
      .endFill()
  }

  postConversion(sprite: Sprite, payload: BallAttributes): void {
    sprite.x = payload.x
    sprite.y = payload.y
  }

  update(_delta: number): void {
    if (!this.trail && this.sprite) {
      this.trail = new Trail(this.sprite)
    }
    if (this.trail) {
      this.trail.onTick(_delta)
    }
  }
}
