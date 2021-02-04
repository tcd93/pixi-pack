import { GameObject, GameObjectParameter } from '../../app/GameObject'
import { Graphics, Application, Sprite } from 'pixi.js'
import { Shapeable } from '../../app/Shapeable'
import { Convertable } from '../../app/Convertable'
import { UserDefinedPhysics, Materialized } from '../../app/Materialized'
import { Body } from 'matter-js'
import { Interactable } from '../../app/Interactable'
import { defaultLayout, paddleBody } from '../../config'

type PaddleAttributes = {
  /** the movement speed of paddle */
  forceMultiplier?: number,
  width?: number,
  height?: number,
} & GameObjectParameter
  & UserDefinedPhysics

type ctor = {
  app: Application
} & PaddleAttributes

function withDefault(attrs: PaddleAttributes): PaddleAttributes {
  return {
    ...{
      x: defaultLayout.paddle.width / 2,
      y: defaultLayout.paddle.height / 2,
      width: defaultLayout.paddle.width,
      height: defaultLayout.paddle.height,
      hitBoxShape: 'rect',
      forceMultiplier: 1,
      ...paddleBody,
    }, ...attrs
  }
}

export class Paddle extends Interactable(Materialized(GameObject)) implements Shapeable, Convertable {
  private isLeftPressed: boolean
  private isRightPressed: boolean
  private forceMultiplier: number

  private physicsBody: Body
  private sprite: Sprite

  constructor({ app, ...attributes }: ctor) {
    const attr = withDefault(attributes)
    super(app, attr)

    this.forceMultiplier = attr.forceMultiplier

    if (this.key && typeof this.key === 'function') {
      this.key('ArrowLeft').onPress = () => this.isLeftPressed = true
      this.key('ArrowLeft').onRelease = () => this.isLeftPressed = false
      this.key('ArrowRight').onPress = () => this.isRightPressed = true
      this.key('ArrowRight').onRelease = () => this.isRightPressed = false
    }
  }

  requireGraphics(payload: PaddleAttributes): Graphics {
    return new Graphics()
      .beginFill(0xF7F7F7)
      .lineStyle(3, 0xF7F7F7, 0.8)
      .drawRect(0, 0, payload.width, payload.height)
      .endFill()
  }

  postConversion(sprite: Sprite, _: PaddleAttributes): void {
    this.sprite = sprite
  }

  onLoad(physicsBody: Body) {
    this.physicsBody = physicsBody
  }

  fixedUpdate(_delta: number) {
    if (this.isLeftPressed) {
      Body.applyForce(this.physicsBody, {
        x: this.physicsBody.position.x + this.sprite.width / 2, // apply force from the right edge
        y: this.physicsBody.position.y
      }, {
        x: -1 * _delta * this.forceMultiplier,
        y: 0,
      })
    }
    if (this.isRightPressed) {
      Body.applyForce(this.physicsBody, {
        x: this.physicsBody.position.x - this.sprite.width / 2, // apply force from the left edge
        y: this.physicsBody.position.y
      }, {
        x: _delta * this.forceMultiplier,
        y: 0,
      })
    }
  }
}
