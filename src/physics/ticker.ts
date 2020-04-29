import { Ticker } from 'pixi.js';
import { SpriteExt } from './Materialized';

/**A global class for all physics objects, so that they can interact
 * with each other*/
export class Physics {
  /** An array that stores all sprites rigistered for physics detection */
  static sprites: SpriteExt[] = [];

  static ticker = new Ticker();
}