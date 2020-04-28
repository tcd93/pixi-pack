import { Loader, AnimatedSprite, utils, Application, SCALE_MODES, Sprite } from 'pixi.js';
import { Global } from '../Global';
import { IAnimatableAsset, isAssetInstance } from './IAnimatableAsset';
import { isGraphicsInstance } from './IGraphics';
import { isConvertible } from './IConvertable';

export type GameObjectParameter = {
  /** required, must be unique among game objects */
  name: string,
  /** required if using with `Materialized` to add hit detection */
  hitBoxShape?: 'circle' | 'rect',
  /** payload data to pass around in callback methods (`postConversion`...) */
  payload?: Object,
  /** use custom loader, default to `Loader.shared` */
  loader?: Loader
}

export class GameObject {
  constructor(app: Application, parameter: GameObjectParameter) {
    if (isAssetInstance(this)) {
      this.loadAsset(app, parameter.loader, this).then(sprite => {
        sprite.name = parameter.name;
        // use the sprite name as event name
        emitEvent(sprite.name, sprite);
      });
    }

    if (isGraphicsInstance(this)) {
      const graphics = this.requireGraphics();
      if (isConvertible(this)) {
        const renderTexture = app.renderer.generateTexture(graphics, SCALE_MODES.NEAREST, 2);
        const sprite = new Sprite(renderTexture);

        sprite.name = parameter.name;
        this.postConversion(sprite, parameter.payload);
        emitEvent(sprite.name, sprite);

        app.stage.addChild(sprite);
      } else {
        app.stage.addChild(graphics);
      }
    }

    app.ticker.add(this.update.bind(this));
  }

  /** the app will try to execute this method 60 times per second */
  protected update(_delta: number): void {}

  private loadAsset(app: Application, loader: Loader, self: IAnimatableAsset) : Promise<Sprite>
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