import { GameObject, GameObjectParameter } from '../../app/GameObject'
import { Graphics, Application, Sprite } from 'pixi.js'
import { Shapeable } from '../../app/Shapeable'
import { Convertable } from '../../app/Convertable'
import { Materialized, UserDefinedPhysics } from '../../physics/Materialized'
import { Trail } from './Trail/Trail'
import { Body, Vector } from 'matter-js'
import { Interactable } from '../../app/Interactable'
import { ballBody, defaultLayout } from '../../config'

type BallAttributes = {
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
      x: defaultLayout.container.width / 2,
      y: defaultLayout.container.height / 2,
      ...ballBody,
    }, ...attr
  }
}

export class Ball extends Interactable(Materialized(GameObject)) implements Shapeable, Convertable {
  private trail: Trail
  private isGameStarted: Boolean
  private onCollisionCallback: (other: Body) => void

  constructor({ app, onCollisionCallback, ...attributes }: ctor) {
    super(app, withDefault(attributes))

    this.onCollisionCallback = onCollisionCallback
  }

  onLoad(physicsBody: Body) {
    if (this.key && typeof this.key === 'function') {
      this.key(' ').onRelease = () => {
        if (physicsBody && !this.isGameStarted) {
          Body.setVelocity(physicsBody, Vector.rotate(
            { x: 1.5, y: 1.5 },
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

  update(_delta: number): void {
    this.trail.onTick(_delta)
  }
}
