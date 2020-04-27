import { Sprite } from 'pixi.js';

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