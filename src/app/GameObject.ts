import { Loader, AnimatedSprite, utils, Application, SCALE_MODES, Sprite } from 'pixi.js';
import { IAnimatableAsset } from './IAnimatableAsset';
import { IGraphics } from './IGraphics';
import { IConvertable } from './IConvertable';
import { Global } from '../Global';

export type GameObjectParameter = {
  app: Application,
  name: string,
  payload?: Object,
  loader?: Loader
}

export class GameObject {
  constructor(parameter: GameObjectParameter) {
    if (isAssetInstance(this)) {
      this.loadAsset(parameter, this).then(sprite => {
        sprite.name = parameter.name;
        // use the sprite name as event name
        emitEvent(sprite.name, sprite);
      });
    }

    if (isGraphicsInstance(this)) {
      const graphics = this.requireGraphics();
      if (isConvertible(this)) {
        const renderTexture = parameter.app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 2);
        const sprite = new Sprite(renderTexture);

        sprite.name = parameter.name;
        this.postConversion(sprite, parameter.payload);
        emitEvent(sprite.name, sprite);

        parameter.app.stage.addChild(sprite);
      } else {
        parameter.app.stage.addChild(graphics);
      }
    }

    parameter.app.ticker.add(this.update.bind(this));
  }

  /** the app will try to execute this method 60 times per second */
  protected update(_delta: number): void {}

  private loadAsset({ app, loader }: GameObjectParameter, self: IAnimatableAsset) : Promise<Sprite>
  {
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

    return new Promise(resolve => {
      baseLoader.load(() => {
        const sprite = self.onAssetLoaded();
        app.stage.addChild(sprite);
        if (sprite instanceof AnimatedSprite) {
          sprite.play();
        }
        resolve(sprite);
      });
    })
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

/** emit event after a brief delay, to ensure all listeners are registerd */
function emitEvent(name: string, data: any) {
  setTimeout(() => {
    console.debug(`--- emitting event: ${name} ---`);
    Global.emitter.emit(name, data);
  }, 25);
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