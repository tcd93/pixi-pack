import { Loader, AnimatedSprite, utils, Application, SCALE_MODES, Sprite } from 'pixi.js'
import { AnimatableAsset, isAssetInstance } from './AnimatableAsset'
import { isGraphicsInstance } from './Shapeable'
import { isConvertible } from './Convertable'
import { isMaterialiazed, UserDefinedPhysics } from '../physics/Materialized'

export type GameObjectParameter = {
  /**the unique name of sprite */
  name: string
  /** use custom loader, default to `Loader.shared` */
  loader?: Loader
}

export class GameObject {
  constructor(app: Application, parameter?: GameObjectParameter & UserDefinedPhysics) {
    if (isAssetInstance(this)) {
      this.loadAsset(app, parameter?.loader, this).then(sprite => {
        sprite.name = parameter?.name
        if (isMaterialiazed(this)) {
          this.onSpriteLoaded(sprite, parameter);
        }
      })
    }

    if (isGraphicsInstance(this)) {
      const graphics = this.requireGraphics(parameter)
      if (isConvertible(this)) {
        const renderTexture = app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 2)
        const sprite = new Sprite(renderTexture)

        sprite.name = parameter?.name
        this.postConversion(sprite, parameter)
        if (isMaterialiazed(this)) {
          this.onSpriteLoaded(sprite, parameter);
        }

        app.stage.addChild(sprite)
      } else {
        app.stage.addChild(graphics)
      }
    }

    app.ticker.add(this.update.bind(this))
  }

  /** the app will try to execute this method 60 times per second */
  protected update(_delta: number): void { }

  private loadAsset(app: Application, loader: Loader, self: AnimatableAsset): Promise<Sprite> {
    const baseLoader = loader ?? Loader.shared
    if (!baseLoader.loading) {
      // flatten into a single array of files
      const assets = Object.values(self.requireAsset()).flat()
      add(baseLoader, assets)
    } else {
      baseLoader.onComplete.once(() => {
        const assets = Object.values(self.requireAsset()).flat()
        add(baseLoader, assets)
      })
    }

    return new Promise(resolve => {
      baseLoader.load(() => {
        const sprite = self.onAssetLoaded()
        app.stage.addChild(sprite)
        if (sprite instanceof AnimatedSprite) {
          sprite.play()
        }
        resolve(sprite)
      })
    })
  }
}

/** make sure we don't load dupplicated resources into the cache */
function add(loader: Loader, assets: string[]) {
  loader.add(
    assets.filter(function (value) {
      return !this[value]
    }, utils.TextureCache)
  )
}