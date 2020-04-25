import { Sprite } from 'pixi.js';

/**
 * implement this interface to use external assets
 */
export interface IAsset {
  /**
   * Called on construction to feed assets to the loader
   */
  requireAsset(): Object

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  onAssetLoaded(): Sprite
}