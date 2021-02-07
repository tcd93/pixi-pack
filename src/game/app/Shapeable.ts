import type { Graphics } from 'pixi.js'
import type { GameObject } from './GameObject'

/**
 * draw graphic & shapes
 */
export interface Shapeable {
  /**
   * Called on construction to add graphics to app stage
   */
  requireGraphics(payload?: unknown): Graphics
}

export function isGraphicsInstance(instance: Shapeable | GameObject): instance is Shapeable {
  return (
    (instance as Shapeable).requireGraphics !== undefined
  )
}