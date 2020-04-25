import { Loader, Container, Sprite, AnimatedSprite, utils } from 'pixi.js';

type GameObjectParameter = {
  stage: Container,
  loader?: Loader
}

// make sure we don't load dupplicated resources into the cache
function add(loader: Loader, assets: string[]) {
  loader.add(
    assets.filter(function(value) {
      return !this[value]
    }, utils.TextureCache)
  );
}

export abstract class GameObject {
  constructor(parameter: GameObjectParameter) {
    const baseLoader = parameter.loader ?? Loader.shared;
    if (!baseLoader.loading) {
      // flatten into a single array of files
      const assets = Object.values(this.requireAsset()).flat();
      add(baseLoader, assets);
    } else {
      baseLoader.once('complete', () => {
        const assets = Object.values(this.requireAsset()).flat();
        add(baseLoader, assets);
      })
    }

    baseLoader.load(() => {
      const sprite = this.onAssetLoaded();
      parameter.stage.addChild(sprite);
      if (sprite instanceof AnimatedSprite) 
        sprite.play();
    });
  }

  /**
   * Called on construction to feed assets to the loader
   */
  abstract requireAsset(): Object

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  abstract onAssetLoaded(): Sprite
}