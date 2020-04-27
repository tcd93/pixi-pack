import { Point, Sprite, Ticker } from 'pixi.js';
import { Global } from '../Global';

// Needed for all mixins
type Constructor < T = {} > = new(...args: any[]) => T;

/**
 * "Materialize" a game object, adding rigid body to its property
 */
export function Materialize < T extends Constructor > (Base: T) {
  class RigidBody extends Base {
    acceleration = new Point(0);
    movementSpeed = 0;
    sprite: Sprite;
    private physicTicker = new Ticker();

    constructor(...args: any[]) {
      super(...args);
      if (!args[0]['name']) {
        throw new Error('name argument is required in the GameObject parameter');
      }
      const name = args[0]['name'];
      Global.emitter.once(name, this.onSpriteLoaded.bind(this));
      // create a separate ticker for handling physics related stuff
      this.physicTicker.autoStart = true;
      this.physicTicker.add(this.physicsUpdate.bind(this));
    }

    private onSpriteLoaded(sprite: Sprite) {
      console.debug(`--- sprite loaded: ${sprite.name} ---`);
      this.sprite = sprite;
      Global.physicsSprites.push(sprite);
    }

    private physicsUpdate(_delta: number): void {
      for (let i = 0; i < Global.physicsSprites.length; i++) {
        for (let j = i + 1; j < Global.physicsSprites.length; j++) {
          const currentSprite = Global.physicsSprites[i];
          const nextSprite = Global.physicsSprites[j]; // test against this sprite
          if (testForImpact(currentSprite, nextSprite)) {
            console.log(`Impact between ${currentSprite.name} and ${nextSprite.name}`);
            // alert(`Impact between ${currentSprite.name} and ${nextSprite.name}`);
          }
        }
      }
    }
  }

  return RigidBody;
}

function testForImpact(object1: Sprite, object2: Sprite) {
  if (!object1 || !object2) return false;

  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds2.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds2.height > bounds2.y;
}