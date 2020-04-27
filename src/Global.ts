import { utils, Sprite } from "pixi.js";

/**  A helper class */
export class Global {
  /** An array that stores all sprites rigistered for physics detection */
  static physicsSprites: Sprite[] = [];
  
  static emitter = new utils.EventEmitter();
}