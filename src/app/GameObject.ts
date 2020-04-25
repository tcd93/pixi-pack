import { Loader, Container, AnimatedSprite, utils } from 'pixi.js';
import { IAsset } from './IAsset';
import { IGraphics } from './IGraphics';

type GameObjectParameter = {
  stage: Container,
  loader?: Loader
}

export class GameObject {
  constructor(parameter: GameObjectParameter) {
    if (isAssetInstance(this)) {
      this.loadAsset(parameter, this);
    }
    if (isGraphicsInstance(this)) {
      this.loadGraphics(parameter, this);
    }
  }

  private loadAsset({ stage, loader }: GameObjectParameter, self: IAsset) {
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
      stage.addChild(sprite);
      if (sprite instanceof AnimatedSprite) {
        sprite.play();
      }
    });
  }

  private loadGraphics({ stage }: GameObjectParameter, self: IGraphics) {
    stage.addChild(self.requireGraphics());
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
// typescript is bad at type-guarding stuff
function isAssetInstance(instance: IAsset | GameObject): instance is IAsset {
  return (
    (instance as IAsset).requireAsset !== undefined &&
    (instance as IAsset).onAssetLoaded != undefined
  );
}

/** type-check if this instance implements the IGraphics interface */
function isGraphicsInstance(instance: IGraphics | GameObject): instance is IGraphics {
  return (
    (instance as IGraphics).requireGraphics !== undefined
  );
}