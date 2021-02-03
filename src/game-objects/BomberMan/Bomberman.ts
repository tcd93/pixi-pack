import { AnimatedSprite, Texture, Application } from "pixi.js"
import { GameObject, GameObjectParameter } from "../../app/GameObject"
import { importAll, debugRect } from "../../common/common"
import { AnimatableAsset } from "../../app/AnimatableAsset"
import { UserDefinedPhysics } from "../../physics/Materialized"

const bomberFrames = {
  front: importAll(require.context('./assets/images/front', false, /\.png$/)),
  back: importAll(require.context('./assets/images/back', false, /\.png$/)),
  left: importAll(require.context('./assets/images/left', false, /\.png$/)),
  right: importAll(require.context('./assets/images/right', false, /\.png$/))
}

type BombermanAttributes = {
  animationSpeed: AnimatedSprite['animationSpeed'],
  currentDirection: keyof { front: string, back: string, left: string, right: string }
} & GameObjectParameter
  & UserDefinedPhysics

type ctor = {
  app: Application
  attributes: BombermanAttributes
}

export class Bomberman extends GameObject implements AnimatableAsset {
  private attributes: BombermanAttributes

  constructor({ app, attributes }: ctor) {
    super(app, attributes)

    this.attributes = attributes
  }

  requireAsset(): Object {
    return bomberFrames
  }

  onAssetLoaded(): AnimatedSprite {
    let sprite = new AnimatedSprite(bomberFrames[this.attributes.currentDirection].map((path) => Texture.from(path)));

    sprite.animationSpeed = this.attributes.animationSpeed

    //DEBUG
    debugRect(sprite)

    return sprite
  }
}