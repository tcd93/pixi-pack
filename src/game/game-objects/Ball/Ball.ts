import { Body, Vector } from 'matter-js'
import { Graphics, Application, Sprite } from 'pixi.js'

import { GameObject, GameObjectParameter, Shapeable, Convertable, Interactive, Materialized, UserDefinedPhysics, key } from '@game/app'
import { Trail } from './Trail/Trail'
import { ballBody, defaultLayout } from '../../../game_config'

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

export class Ball extends Interactive(Materialized(GameObject)) implements Shapeable, Convertable {
  private trail: Trail
  private isGameStarted: boolean
  private physicsBody: Body
  private constantSpeed: number
  private onCollisionCallback: (other: Body) => void

  /**
   * This is just a "placeholder" so that TS compiler doesn't scream;
   * I have no idea why ts intellisense can't figure out the Interactive mixin...
   */
  private onKey: (value: string) => key

  constructor({ app, onCollisionCallback, ...attributes }: ctor) {
    const attr = withDefault(attributes)
    super(app, attr)

    this.constantSpeed = attr.constantSpeed
    this.onCollisionCallback = onCollisionCallback
  }

  onLoad(physicsBody: Body): void {
    this.physicsBody = physicsBody

    this.onKey(' ').onRelease = () => {
      if (physicsBody && !this.isGameStarted) {
        Body.setVelocity(physicsBody, Vector.rotate(
          Vector.create(1, 1),
          Math.random(),
        ))

        this.isGameStarted = true
      }
    }
  }

  onCollision(other: Body): void {
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

  fixedUpdate(_delta: number): void {
    const speed = this.physicsBody.speed
    // keep the speed constant (matterjs does not have settings for that)
    if (speed < this.constantSpeed) {
      Body.setVelocity(
        this.physicsBody,
        Vector.mult(Vector.normalise(this.physicsBody.velocity), this.constantSpeed * _delta)
      )
    }

    // some mumbo-jumbo here to spice up the gameplay!
    const { x, y } = this.physicsBody.velocity
    const m = this.constantSpeed - 0.5
    if (x > m) { // (does not allow the angle to X-axis fall low)
      Body.setVelocity(
        this.physicsBody,
        Vector.create((m - 0.2) * Math.random() * _delta + 0.2, y)
      )
    }
  }
}
