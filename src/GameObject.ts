import { Loader, Container, Sprite, AnimatedSprite, utils } from 'pixi.js';

type GameObjectParameter = {
  stage: Container,
  loader?: Loader
}

export abstract class GameObject {
  constructor(parameter: GameObjectParameter) {
    const baseLoader = parameter.loader ?? Loader.shared;
    // make sure we don't load dupplicated resources into the cache
    if (!baseLoader.loading) {
      const assets = Object.values(this.requireAsset());
      baseLoader.add(assets);
    } else {
      baseLoader.once('complete', (loader, currentResources) => {
        const assets = this.requireAsset();
        loader.add(
          assets.filter(value => !Object.keys(currentResources).includes(value))
        );
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
  abstract requireAsset(): any[]

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  abstract onAssetLoaded(): Sprite
}