import { Sprite } from 'pixi.js';
import { GameObject } from './GameObject';

/**
 * implement this interface to use external animatable sprites
 */
export interface IAnimatableAsset {
  /**
   * Called on construction to feed assets to the loader, must not return null
   */
  requireAsset(): Object

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  onAssetLoaded(): Sprite
}

/** type-check if this instance implements the IAsset interface */
// typescript guard types via duck-typing, no you don't need to implement this interface to be an Asset game object
export function isAssetInstance(instance: IAnimatableAsset | GameObject): instance is IAnimatableAsset {
  return (
    (instance as IAnimatableAsset).requireAsset !== undefined &&
    (instance as IAnimatableAsset).onAssetLoaded != undefined
  );
}