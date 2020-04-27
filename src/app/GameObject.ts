import { Loader, AnimatedSprite, utils, Application, SCALE_MODES, Sprite } from 'pixi.js';
import { IAnimatableAsset } from './IAnimatableAsset';
import { IGraphics } from './IGraphics';
import { IConvertable } from './IConvertable';

type GameObjectParameter = {
  app: Application,
  loader?: Loader
}

export class GameObject {
  constructor(parameter: GameObjectParameter) {
    if (isAssetInstance(this)) {
      this.loadAsset(parameter, this);
    }

    if (isGraphicsInstance(this)) {
      const graphics = this.requireGraphics();
      if (isConvertible(this)) {
        const renderTexture = parameter.app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 2);
        const sprite = new Sprite(renderTexture);
        this.postConversion(sprite);
        
        parameter.app.stage.addChild(sprite);
      } else {
        parameter.app.stage.addChild(graphics);
      }
    }

    parameter.app.ticker.add(this.update.bind(this));
  }

  /** the app will try to execute this method 60 times per second */
  protected update(_delta: number): void {}

  private loadAsset({ app, loader }: GameObjectParameter, self: IAnimatableAsset) {
    const baseLoader = loader ?? Loader.shared;
    if (!baseLoader.loading) {
      // flatten into a single array of files
      const assets = Object.values(self.requireAsset()).flat();
      add(baseLoader, assets);
    } else {
      baseLoader.once('complete', () => {
        const assets = Object.values(self.requireAsset()).flat();
        add(baseLoader, assets);
      })
    }

    baseLoader.load(() => {
      const sprite = self.onAssetLoaded();
      app.stage.addChild(sprite);
      if (sprite instanceof AnimatedSprite) {
        sprite.play();
      }
    });
  }
}

/** make sure we don't load dupplicated resources into the cache */
function add(loader: Loader, assets: string[]) {
  loader.add(
    assets.filter(function(value) {
      return !this[value]
    }, utils.TextureCache)
  );
}

/** type-check if this instance implements the IAsset interface */
// typescript guard types via duck-typing, no you don't need to implement this interface to be an Asset game object
function isAssetInstance(instance: IAnimatableAsset | GameObject): instance is IAnimatableAsset {
  return (
    (instance as IAnimatableAsset).requireAsset !== undefined &&
    (instance as IAnimatableAsset).onAssetLoaded != undefined
  );
}

/** type-check if this instance implements the IGraphics interface */
function isGraphicsInstance(instance: IGraphics | GameObject): instance is IGraphics {
  return (
    (instance as IGraphics).requireGraphics !== undefined
  );
}

function isConvertible(instance: IConvertable | IGraphics): instance is IConvertable {
  return (
    (instance as IConvertable).postConversion !== undefined
  );
}