import type { Sprite } from 'pixi.js'
import type { GameObject, GameObjectParameter } from './GameObject'

/**
 * implement this interface to use external animatable sprites
 */
export interface AnimatableAsset {
  /**
   * Called on construction to feed assets to the loader, must not return null
   */
  requireAsset(param: GameObjectParameter): Promise<string>[] | string[]

  /**
   * Called when the game object's loader finished,
   * returned sprite object would be animated automatically
   */
  onAssetLoaded(param: GameObjectParameter): Promise<Sprite> | Sprite
}

/** type-check if this instance implements the IAsset AnimatableAsset */
export function isAssetInstance(instance: AnimatableAsset | GameObject): instance is AnimatableAsset {
  return (
    (instance as AnimatableAsset).requireAsset !== undefined &&
    (instance as AnimatableAsset).onAssetLoaded != undefined
  )
}