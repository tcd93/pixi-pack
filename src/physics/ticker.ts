import { Ticker, Sprite } from 'pixi.js';

/**A global class for all physics objects, so that they can interact
 * with each other*/
export class Physics {
  /** An array that stores all sprites rigistered for physics detection */
  static sprites: Sprite[] = [];

  static ticker = new Ticker();
}