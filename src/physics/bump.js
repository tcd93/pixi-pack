/**
 * Test if `sprite1` collides with `sprite2`
 * @param {PIXI.Sprite} sprite1 
 * @param {PIXI.Sprite} sprite2 
 * @param {boolean?} bounce
 */
export function hit(sprite1, sprite2, bounce = false) {
  if (!sprite1 || !sprite2) return;
  
  if (sprite1.hitBoxShape === 'rect' && sprite2.hitBoxShape === 'rect') {
    return rectangleCollision(sprite1, sprite2, bounce)
  } 

  throw new Error('Other hitBoxShapes are not implemented yet, haha')
}

//TODO: look at the `bounce` effect at https://github.com/lycwed/pixi-plugin-bump/blob/master/src/bump.js#L1340


/**
 * @param {PIXI.Sprite} r1 
 * @param {PIXI.Sprite} r2 
 * @param {boolean} bounce
 * @returns {"top" | "bottom" | "left" | "right"} which side of r1 is touching r2
 */
function rectangleCollision(r1, r2, bounce) {
  if (!r1._bumpPropertiesAdded) addCollisionProperties(r1);
  if (!r2._bumpPropertiesAdded) addCollisionProperties(r2);

  let collision, combinedHalfWidths, combinedHalfHeights, overlapX, overlapY, vx, vy;

  vx = r1.x + Math.abs(r1.halfWidth) - r1.xAnchorOffset - (r2.x + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
  vy = r1.y + Math.abs(r1.halfHeight) - r1.yAnchorOffset - (r2.y + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
  
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = Math.abs(r1.halfWidth) + Math.abs(r2.halfWidth);
  combinedHalfHeights = Math.abs(r1.halfHeight) + Math.abs(r2.halfHeight);

  //Check if collision is occuring on the X axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //Check if collision is occuring on the Y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //Find out the size of the overlap on both the X and Y axes
      overlapX = combinedHalfWidths - Math.abs(vx);
      overlapY = combinedHalfHeights - Math.abs(vy);

      //The collision has occurred on which the axis with the *smallest* amount of overlap
      if (overlapX >= overlapY) {

        if (vy > 0) {
          collision = "top";
          //Move the rectangle out of the collision
          r1.y = r1.y + overlapY;
        } else {
          collision = "bottom";
          r1.y = r1.y - overlapY;
        }

        if (bounce) {
          r1.vy *= -1;
        }
      } else {

        if (vx > 0) {
          collision = "left";
          r1.x = r1.x + overlapX;
        } else {
          collision = "right";
          r1.x = r1.x - overlapX;
        }

        if (bounce) {
          r1.vx *= -1;
        }
      }
    }
  }
  return collision;
}

/**
 * `contain` can be used to contain a sprite with `x` and y` properties inside a rectangular area.

  The `contain` function takes four arguments: a sprite with `x` and `y`
  properties, an object literal with `x`, `y`, `width` and `height` properties. The 
  third argument is a Boolean (true/false) value that determines if the sprite
  should bounce when it hits the edge of the container. The fourth argument
  is an extra user-defined callback function that you can call when the
  sprite hits the container
  ```js
  contain(anySprite, {x: 0, y: 0, width: 512, height: 512}, true, callbackFunction);
  ```
  The code above will contain the sprite's position inside the 512 by
  512 pixel area defined by the object. If the sprite hits the edges of
  the container, it will bounce. The `callBackFunction` will run if 
  there's a collision.

  An additional feature of the `contain` method is that if the sprite
  has a `mass` property, it will be used to dampen the sprite's bounce
  in a natural looking way.

  If the sprite bumps into any of the containing object's boundaries,
  the `contain` function will return a value that tells you which side
  the sprite bumped into: “left”, “top”, “right” or “bottom”. Here's how
  you could keep the sprite contained and also find out which boundary
  it hit:
  ```js
  //Contain the sprite and find the collision value
  var collision = contain(anySprite, {x: 0, y: 0, width: 512, height: 512});

  //If there's a collision, display the boundary that the collision happened on
  if(collision) {
    if collision.has("left") console.log("The sprite hit the left");  
    if collision.has("top") console.log("The sprite hit the top");  
    if collision.has("right") console.log("The sprite hit the right");  
    if collision.has("bottom") console.log("The sprite hit the bottom");  
  }
  ```
  If the sprite doesn't hit a boundary, the value of
  `collision` will be `undefined`. 
 * @param {PIXI.Sprite} sprite 
 * @param {{x: number, y: number, width: number, height: number}} container 
 * @param {boolean} bounce 
 * @param {(collision: Set) => void} extra 
 */
export function contain(sprite, container, bounce, extra = undefined) {
  //Add collision properties
  if (!sprite._bumpPropertiesAdded) addCollisionProperties(sprite);

  //Give the container x and y anchor offset values, if it doesn't
  //have any
  if (container.xAnchorOffset === undefined) container.xAnchorOffset = 0;
  if (container.yAnchorOffset === undefined) container.yAnchorOffset = 0;
  if (sprite.parent.gx === undefined) sprite.parent.gx = 0;
  if (sprite.parent.gy === undefined) sprite.parent.gy = 0;

  //Create a Set called `collision` to keep track of the
  //boundaries with which the sprite is colliding
  var collision = new Set();

  //Left
  if (sprite.x - sprite.xAnchorOffset < container.x - sprite.parent.gx - container.xAnchorOffset) {
    //Bounce the sprite if `bounce` is true
    if (bounce) sprite.vx *= -1;
    //If the sprite has `mass`, var the mass, affect the sprite's velocity
    if (sprite.mass) sprite.vx /= sprite.mass;
    //Reposition the sprite inside the container
    sprite.x = container.x - sprite.parent.gx - container.xAnchorOffset + sprite.xAnchorOffset;
    collision.add("left");
  }

  //Top
  if (sprite.y - sprite.yAnchorOffset < container.y - sprite.parent.gy - container.yAnchorOffset) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = container.y - sprite.parent.gy - container.yAnchorOffset + sprite.yAnchorOffset;
    collision.add("top");
  }

  //Right
  if (sprite.x - sprite.xAnchorOffset + sprite.width > container.width - container.xAnchorOffset) {
    if (bounce) sprite.vx *= -1;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = container.width - sprite.width - container.xAnchorOffset + sprite.xAnchorOffset;
    collision.add("right");
  }

  //Bottom
  if (sprite.y - sprite.yAnchorOffset + sprite.height > container.height - container.yAnchorOffset) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = container.height - sprite.height - container.yAnchorOffset + sprite.yAnchorOffset;
    collision.add("bottom");
  }

  if (collision.size === 0) collision = undefined;

  //The `extra` function runs if there was a collision
  if (collision && extra) extra(collision);

  return collision;
}

/**
 * adds extra properties to sprites to help 
 * simplify the collision code. It won't add these properties if they
 * already exist on the sprite. After these properties have been
 * added, this methods adds a Boolean property to the sprite called `_bumpPropertiesAdded`
 * and sets it to `true` to flag that the sprite has these new properties
 * @param {Sprite} sprite 
 */
function addCollisionProperties(sprite) {
  //gx
  if (sprite.gx === undefined) {
    Object.defineProperty(sprite, "gx", {
      get: function() {
        return sprite.getGlobalPosition().x;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //gy
  if (sprite.gy === undefined) {
    Object.defineProperty(sprite, "gy", {
      get: function() {
        return sprite.getGlobalPosition().y;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //centerX
  if (sprite.centerX === undefined) {
    Object.defineProperty(sprite, "centerX", {
      get: function() {
        return sprite.x + sprite.width / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //centerY
  if (sprite.centerY === undefined) {
    Object.defineProperty(sprite, "centerY", {
      get: function() {
        return sprite.y + sprite.height / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //halfWidth
  if (sprite.halfWidth === undefined) {
    Object.defineProperty(sprite, "halfWidth", {
      get: function() {
        return sprite.width / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //halfHeight
  if (sprite.halfHeight === undefined) {
    Object.defineProperty(sprite, "halfHeight", {
      get: function() {
        return sprite.height / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //xAnchorOffset
  if (sprite.xAnchorOffset === undefined) {
    Object.defineProperty(sprite, "xAnchorOffset", {
      get: function() {
        if (sprite.anchor !== undefined) {
          return sprite.width * sprite.anchor.x;
        } else {
          return 0;
        }
      },
      enumerable: true,
      configurable: true,
    });
  }

  //yAnchorOffset
  if (sprite.yAnchorOffset === undefined) {
    Object.defineProperty(sprite, "yAnchorOffset", {
      get: function() {
        if (sprite.anchor !== undefined) {
          return sprite.height * sprite.anchor.y;
        } else {
          return 0;
        }
      },
      enumerable: true,
      configurable: true,
    });
  }

  if (sprite.circular && sprite.radius === undefined) {
    Object.defineProperty(sprite, "radius", {
      get: function() {
        return sprite.width / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }
  //Add a Boolean `_bumpPropertiesAdded` property to the sprite to flag it
  //as having these new properties
  sprite._bumpPropertiesAdded = true;
}