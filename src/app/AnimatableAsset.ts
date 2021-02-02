import { Sprite } from 'pixi.js';
import { GameObject } from './GameObject';

/**
 * implement this interface to use external animatable sprites
 */
export interface AnimatableAsset {
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

/** type-check if this instance implements the IAsset AnimatableAsset */
export function isAssetInstance(instance: AnimatableAsset | GameObject): instance is AnimatableAsset {
  return (
    (instance as AnimatableAsset).requireAsset !== undefined &&
    (instance as AnimatableAsset).onAssetLoaded != undefined
  );
}