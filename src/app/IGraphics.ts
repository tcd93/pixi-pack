import { Graphics } from 'pixi.js';

/**
 * draw graphic & shapes
 */
export interface IGraphics {
  /**
   * Called on construction to add graphics to app stage
   */
  requireGraphics(): Graphics
}