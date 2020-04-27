import { Sprite } from "pixi.js";

/**
 * convert graphic to sprite
 */
export interface IConvertable {
  /**
   * Called after conversion is done
   */
  postConversion(sprite: Sprite, payload?: Object): void;
}