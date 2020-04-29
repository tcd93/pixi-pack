import { Sprite } from 'pixi.js';
import { IGraphics } from './IGraphics';

/**
 * convert graphic to sprite, should be used with `IGraphics`
 */
export interface IConvertable {
  /**
   * Called after conversion is done
   */
  postConversion(sprite: Sprite, payload?: Object): void;
}

export function isConvertible(instance: IConvertable | IGraphics): instance is IConvertable {
  return (
    (instance as IConvertable).postConversion !== undefined
  );
}