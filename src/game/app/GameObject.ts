import { Loader, AnimatedSprite, utils, Application, SCALE_MODES, Sprite } from 'pixi.js'
import { AnimatableAsset, isAssetInstance } from './AnimatableAsset'
import { isGraphicsInstance } from './Shapeable'
import { isConvertible } from './Convertable'
import { isMaterialiazed, UserDefinedPhysics } from './Materialized'

export type GameObjectParameter = {
  /**the unique name of sprite */
  name: string
  /**use custom loader, default to `Loader.shared` */
  loader?: Loader
  /**X-axis*/
  x?: number
  /**Y-axis*/
  y?: number
}

export class GameObject {
  constructor(app: Application, parameter?: GameObjectParameter & UserDefinedPhysics) {
    if (isAssetInstance(this)) {
      this.loadAsset(app, parameter, this).then(sprite => {
        sprite.name = parameter?.name
        this.setPosition(sprite, parameter?.x ?? 0, parameter?.y ?? 0)
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
        
        this.setPosition(sprite, parameter?.x ?? 0, parameter?.y ?? 0)
        app.stage.addChild(sprite)
        
        // postConversion must be called before onSpriteLoaded & after stage addChild
        this.postConversion(sprite, parameter)
        if (isMaterialiazed(this)) {
          this.onSpriteLoaded(sprite, parameter);
        }

      } else {
        app.stage.addChild(graphics)
      }
    }

    app.ticker.add(this.update.bind(this))
  }

  private setPosition(sprite: Sprite, x: number, y: number) {
    sprite.x = x
    sprite.y = y
  }

  /** 
   * the UI update loop (using pixi.shared.ticker);
   * scales with monitor Hz, so don't put physics in here 
   */
  protected update(_delta: number): void { return }

  private async loadAsset(app: Application, parameter: GameObjectParameter, self: AnimatableAsset): Promise<Sprite> {
    const baseLoader = parameter?.loader ?? Loader.shared
    const required = self.requireAsset(parameter)
    if (!required) {
      throw new Error(`"requireAsset()" must not return null, you should use the "parameter" instead of "this" because 
      "this" is not accessible at this time yet`)
    }

    if (!baseLoader.loading) {
      // flatten into a single array of files
      const assets = await Promise.all<string>(Object.values(self.requireAsset(parameter)).flat())
      add(baseLoader, assets)
    } else {
      baseLoader.onComplete.once(async () => {
        const assets = await Promise.all<string>(Object.values(self.requireAsset(parameter)).flat())
        add(baseLoader, assets)
      })
    }

    return new Promise(resolve => {
      baseLoader.load(async () => {
        const sprite = await self.onAssetLoaded(parameter)
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