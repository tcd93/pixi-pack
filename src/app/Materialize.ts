import { Point } from 'pixi.js';

// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialize<T extends Constructor>(Base: T) {
  return class extends Base {
    acceleration = new Point(0);
    movementSpeed = 0;
  };
}