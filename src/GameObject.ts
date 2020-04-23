import { Loader, Container, Sprite, AnimatedSprite } from 'pixi.js';

type GameObjectParameter = {
  stage: Container,
  loader?: Loader
}

export abstract class GameObject {
  constructor(parameter: GameObjectParameter) {
    const loader = parameter.loader ?? new Loader();
    this.requireAsset(loader).load(() => {
      const sprite = this.onAssetLoaded();
      parameter.stage.addChild(sprite);
      if (sprite instanceof AnimatedSprite) 
        sprite.play();
    });
  }

  /**
   * Called on construction to feed assets to the loader
   */
  abstract requireAsset(loader: Loader): Loader

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  abstract onAssetLoaded(): Sprite
}