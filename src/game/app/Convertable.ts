import type { Sprite } from 'pixi.js'
import type { Shapeable } from './Shapeable'

/**
 * convert graphic to sprite, should be used with `Shapeable`
 */
export interface Convertable {
  /**
   * Called after sprite is loaded into app stage
   */
  postConversion(sprite: Sprite, payload?: unknown): void
}

export function isConvertible(instance: Convertable | Shapeable): instance is Convertable {
  return (
    (instance as Convertable).postConversion !== undefined
  )
}