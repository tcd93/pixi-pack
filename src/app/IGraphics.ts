import { Graphics, Application, Sprite } from 'pixi.js';

/**
 * implement this interface draw graphic & shapes
 */
export interface IGraphics {
  /**
   * Called on construction to add grapihc to app stage
   */
  requireGraphics(app: Application): Graphics | Sprite
}