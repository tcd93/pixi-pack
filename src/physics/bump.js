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