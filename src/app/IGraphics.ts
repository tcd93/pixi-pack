import { Graphics } from 'pixi.js';
import { GameObject } from './GameObject';

/**
 * draw graphic & shapes
 */
export interface IGraphics {
  /**
   * Called on construction to add graphics to app stage
   */
  requireGraphics(): Graphics;
}

/** type-check if this instance implements the IGraphics interface */
export function isGraphicsInstance(instance: IGraphics | GameObject): instance is IGraphics {
  return (
    (instance as IGraphics).requireGraphics !== undefined
  );
}