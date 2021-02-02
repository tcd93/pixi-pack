import { Graphics } from 'pixi.js'
import { GameObject } from './GameObject'

/**
 * draw graphic & shapes
 */
export interface Shapeable {
  /**
   * Called on construction to add graphics to app stage
   */
  requireGraphics(payload?: Object): Graphics
}

/** type-check if this instance implements the Shapeable interface */
export function isGraphicsInstance(instance: Shapeable | GameObject): instance is Shapeable {
  return (
    (instance as Shapeable).requireGraphics !== undefined
  )
}