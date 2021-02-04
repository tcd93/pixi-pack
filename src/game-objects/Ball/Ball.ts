import { GameObject, GameObjectParameter } from '../../app/GameObject'
import { Graphics, Application, Sprite } from 'pixi.js'
import { Shapeable } from '../../app/Shapeable'
import { Convertable } from '../../app/Convertable'
import { Materialized, UserDefinedPhysics } from '../../app/Materialized'
import { Trail } from './Trail/Trail'
import { Body, Vector } from 'matter-js'
import { Interactable } from '../../app/Interactable'
import { ballBody, defaultLayout } from '../../config'

type BallAttributes = {
  /**
   * the constant speed of this object
   * @default 1.25
   */
  constantSpeed?: number
  radius?: number
} & GameObjectParameter
  & UserDefinedPhysics

type ctor = {
  app: Application
  onCollisionCallback?: (other: Body) => void
} & BallAttributes

function withDefault(attr: BallAttributes): BallAttributes {
  return {
    ...{
      hitBoxShape: 'circle',
      radius: 5,
      constantSpeed: 1.25,
      x: defaultLayout.container.width / 2,
      y: defaultLayout.container.height / 2,
      ...ballBody,
    }, ...attr
  }
}

export class Ball extends Interactable(Materialized(GameObject)) implements Shapeable, Convertable {
  private trail: Trail
  private isGameStarted: Boolean
  private physicsBody: Body
  private constantSpeed: number
  private onCollisionCallback: (other: Body) => void

  constructor({ app, onCollisionCallback, ...attributes }: ctor) {
    const attr = withDefault(attributes)
    super(app, attr)

    this.constantSpeed = attr.constantSpeed
    this.onCollisionCallback = onCollisionCallback
  }

  onLoad(physicsBody: Body) {
    this.physicsBody = physicsBody

    if (this.key && typeof this.key === 'function') {
      this.key(' ').onRelease = () => {
        if (physicsBody && !this.isGameStarted) {
          Body.setVelocity(physicsBody, Vector.rotate(
            Vector.create(1, 1),
            Math.random(),
          ))

          this.isGameStarted = true
        }
      }
    }
  }

  onCollision(other: Body) {
    this.onCollisionCallback(other)
  }

  requireGraphics(payload: BallAttributes): Graphics {
    //draw a circle
    return new Graphics()
      .beginFill(0xFFFFFF)
      .drawCircle(100, 100, payload.radius)
      .endFill()
  }

  postConversion(sprite: Sprite, _: BallAttributes): void {
    this.trail = new Trail(sprite)
  }

  fixedUpdate(_delta: number): void {
    this.trail.onTick(_delta)

    const speed = this.physicsBody.speed
    // keep the speed constant (matterjs does not have settings for that)
    if (speed < this.constantSpeed) {
      Body.setVelocity(
        this.physicsBody,
        Vector.mult(Vector.normalise(this.physicsBody.velocity), this.constantSpeed)
      )
    }

    // some mumbo-jumbo here to spice up the gameplay!
    const { x, y } = this.physicsBody.velocity
    const m = this.constantSpeed - 0.5
    if (x > m) { // (does not allow the angle to X-axis fall low)
      Body.setVelocity(
        this.physicsBody,
        Vector.create((m - 0.2) * Math.random() + 0.2, y)
      )
    }
  }
}
