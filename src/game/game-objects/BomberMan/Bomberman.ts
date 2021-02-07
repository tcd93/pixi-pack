import type { AnimatableAsset } from "../../app/AnimatableAsset"
import type { UserDefinedPhysics } from "../../app/Materialized"
import { AnimatedSprite, Texture, Application } from "pixi.js"
import { GameObject, GameObjectParameter } from "../../app/GameObject"
import { debugRect } from "../../common/common"

import * as images from 'images/assets/Bomberman'

type BombermanAttributes = {
  animationSpeed?: AnimatedSprite['animationSpeed'],
  currentDirection?: keyof { front: string, back: string, left: string, right: string }
} & GameObjectParameter
  & UserDefinedPhysics

type ctor = {
  app: Application
} & BombermanAttributes

function withDefault(attrs: BombermanAttributes): BombermanAttributes {
  return {
    ...{
      animationSpeed: 1,
      currentDirection: 'right'
    }, ...attrs
  }
}

export class Bomberman extends GameObject implements AnimatableAsset {
  private attributes: BombermanAttributes

  constructor({ app, ...attributes }: ctor) {
    const attr = withDefault(attributes)
    super(app, attr)

    this.attributes = attr
  }

  requireAsset(param: BombermanAttributes): string[] {
    return images[param.currentDirection]
  }

  onAssetLoaded(param: BombermanAttributes): AnimatedSprite {
    const sprite = new AnimatedSprite(images[param.currentDirection].map((path) => Texture.from(path)))

    sprite.animationSpeed = this.attributes.animationSpeed
    //DEBUG
    debugRect(sprite)

    return sprite
  }
}