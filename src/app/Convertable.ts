import { Sprite } from 'pixi.js'
import { Shapeable } from './Shapeable'

/**
 * convert graphic to sprite, should be used with `Shapeable`
 */
export interface Convertable {
  /**
   * Called after conversion is done
   */
  postConversion(sprite: Sprite, payload?: Object): void
}

export function isConvertible(instance: Convertable | Shapeable): instance is Convertable {
  return (
    (instance as Convertable).postConversion !== undefined
  )
}