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
  } else if (sprite1.hitBoxShape === 'circle' && sprite2.hitBoxShape === 'rect') {
    sprite1.circular = true;
    return circleRectangleCollision(sprite1, sprite2, bounce);
  } else if (sprite1.hitBoxShape === 'rect' && sprite2.hitBoxShape === 'circle') {
    sprite2.circular = true; 
    return circleRectangleCollision(sprite2, sprite1, bounce);
  } else {
    //TODO: continue implement circle collision vs moving circle collision
  }

  throw new Error(`${sprite1.hitBoxShape} vs ${sprite2.hitBoxShape} are not implemented yet`);
}

/**
 * @param {PIXI.Sprite} r1 
 * @param {PIXI.Sprite} r2 
 * @param {boolean} bounce
 * @returns {'top' | 'bottom' | 'left' | 'right'} which side of r1 is touching r2
 */
function rectangleCollision(r1, r2, bounce) {
  if (!r1._bumpPropertiesAdded) addCollisionProperties(r1);
  if (!r2._bumpPropertiesAdded) addCollisionProperties(r2);

  let collision, combinedHalfWidths, combinedHalfHeights, overlapX, overlapY, vx, vy;

  vx = r1.x + Math.abs(r1.radius) - r1.xAnchorOffset - (r2.x + Math.abs(r2.halfWidth) - r2.xAnchorOffset);
  vy = r1.y + Math.abs(r1.radius) - r1.yAnchorOffset - (r2.y + Math.abs(r2.halfHeight) - r2.yAnchorOffset);
  
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
          collision = 'top';
          //Move the rectangle out of the collision
          r1.y = r1.y + overlapY;
        } else {
          collision = 'bottom';
          r1.y = r1.y - overlapY;
        }

        if (bounce) {
          r1.vy *= -1;
        }
      } else {

        if (vx > 0) {
          collision = 'left';
          r1.x = r1.x + overlapX;
        } else {
          collision = 'right';
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
 * Use it to boucnce a circle off a point.
 * Parameters: 
 *  * A sprite object with `centerX`, `centerY`, and `radius` properties.
 *  * A point object with `x` and `y` properties.
 * @param {PIXI.Sprite} c1 
 * @param {PIXI.Sprite} r1 
 * @param {boolean} bounce 
 */
function circleRectangleCollision(c1, r1, bounce) {
  if (!r1._bumpPropertiesAdded) addCollisionProperties(r1);
  if (!c1._bumpPropertiesAdded) addCollisionProperties(c1);

  var region, collision, c1x, c1y, r1x, r1y;

  c1x = c1.gx;
  c1y = c1.gy;
  r1x = r1.gx;
  r1y = r1.gy;

  let vx = c1.x + Math.abs(c1.halfWidth) - c1.xAnchorOffset - (r1.x + Math.abs(r1.halfWidth) - r1.xAnchorOffset);
  let vy = c1.y + Math.abs(c1.halfHeight) - c1.yAnchorOffset - (r1.y + Math.abs(r1.halfHeight) - r1.yAnchorOffset);

  let combinedHalfWidths = Math.abs(c1.halfWidth) + Math.abs(r1.halfWidth);
  let combinedHalfHeights = Math.abs(c1.halfHeight) + Math.abs(r1.halfHeight);

  if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
    //Is the circle above the rectangle's top edge?
    if (c1y - c1.yAnchorOffset < r1y - Math.abs(r1.halfHeight) - r1.yAnchorOffset) {
      //check whether it's in the top left, top center or top right
      if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
        region = 'topLeft';
      } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
        region = 'topRight';
      } else {
        region = 'topMiddle';
      }
    } else if (c1y - c1.yAnchorOffset > r1y + Math.abs(r1.halfHeight) - r1.yAnchorOffset) {
      //The circle isn't above the top edge, so it might be below the bottom edge
      //If it is, we need to check whether it's in the bottom left, bottom center, or bottom right
      if (c1x - c1.xAnchorOffset < r1x - 1 - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
        region = 'bottomLeft';
      } else if (c1x - c1.xAnchorOffset > r1x + 1 + Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
        region = 'bottomRight';
      } else {
        region = 'bottomMiddle';
      }
    } else {
      //The circle isn't above the top edge or below the bottom edge,
      //so it must be on the left or right side
      if (c1x - c1.xAnchorOffset < r1x - Math.abs(r1.halfWidth) - r1.xAnchorOffset) {
        region = 'leftMiddle';
      } else {
        region = 'rightMiddle';
      }
    }

    //Is this the circle touching the flat sides of the rectangle?
    if (region === 'topMiddle' || region === 'bottomMiddle' || region === 'leftMiddle' || region === 'rightMiddle') {
      //Yes, it is, so do a standard rectangle vs. rectangle collision test
      collision = rectangleCollision(c1, r1, bounce, global);
    } else {
      //The circle is touching one of the corners, so do a
      //circle vs. point collision test
      var point = {};

      switch (region) {
        case 'topLeft':
          point.x = r1x - r1.xAnchorOffset;
          point.y = r1y - r1.yAnchorOffset;
          break;

        case 'topRight':
          point.x = r1x + r1.width - r1.xAnchorOffset;
          point.y = r1y - r1.yAnchorOffset;
          break;

        case 'bottomLeft':
          point.x = r1x - r1.xAnchorOffset;
          point.y = r1y + r1.height - r1.yAnchorOffset;
          break;

        case 'bottomRight':
          point.x = r1x + r1.width - r1.xAnchorOffset;
          point.y = r1y + r1.height - r1.yAnchorOffset;
      }

      //Check for a collision between the circle and the point
      collision = circlePointCollision(c1, point, bounce);
    }

    if (collision) {
      return region;
    } else {
      return collision;
    }
  }
}

/**
 * Use it to boucnce a circle off a point.
 * Parameters: 
 * * A sprite object with `centerX`, `centerY`, and `radius` properties.
 * * A point object with `x` and `y` properties.
 * @param {PIXI.Sprite} c1 
 * @param {PIXI.Point} point 
 * @param {boolean} bounce 
 */  
function circlePointCollision(c1, point, bounce) {
  if (!c1._bumpPropertiesAdded) addCollisionProperties(c1);

  //A point is just a circle with a diameter of
  //1 pixel, so we can cheat. All we need to do is an ordinary circle vs. circle
  //Collision test. Just supply the point with the properties it needs
  point.diameter = 1;
  point.width = point.diameter;
  point.radius = 0.5;
  point.centerX = point.x;
  point.centerY = point.y;
  point.gx = point.x;
  point.gy = point.y;
  point.xAnchorOffset = 0;
  point.yAnchorOffset = 0;
  point._bumpPropertiesAdded = true;
  return circleCollision(c1, point, bounce, global);
}

/**
 * Use it to prevent a moving circular sprite from overlapping and optionally 
 * bouncing off a non-moving circular sprite.
 * Parameters:  
 * * A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.  
 * * A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.  
 * * Optional: true or false to indicate whether or not the first sprite  
 * should bounce off the second sprite.  
 * 
 * The sprites can contain an optional mass property that should be greater than 1.
 * @param {PIXI.Sprite} c1 
 * @param {PIXI.Sprite} c2 
 * @param {boolean} bounce 
 */
function circleCollision(c1, c2, bounce) {
  if (!c1._bumpPropertiesAdded) addCollisionProperties(c1);
  if (!c2._bumpPropertiesAdded) addCollisionProperties(c2);

  var magnitude,
    combinedRadii,
    overlap,
    vx,
    vy,
    dx,
    dy,
    s = {},
    hit = false;

  //Calculate the vector between the circles’ center points

  vx = c2.gx + c2.width / 2 - c2.xAnchorOffset - (c1.gx + c1.width / 2 - c1.xAnchorOffset);
  vy = c2.gy + c2.width / 2 - c2.yAnchorOffset - (c1.gy + c1.width / 2 - c1.yAnchorOffset);

  //Find the distance between the circles by calculating
  //the vector's magnitude (how long the vector is)
  magnitude = Math.sqrt(vx * vx + vy * vy);

  //Add together the circles' combined half-widths
  combinedRadii = c1.radius + c2.radius;

  //Figure out if there's a collision
  if (magnitude < combinedRadii) {
    //Yes, a collision is happening
    hit = true;

    //Find the amount of overlap between the circles
    overlap = combinedRadii - magnitude;

    //Add some 'quantum padding'. This adds a tiny amount of space
    //between the circles to reduce their surface tension and make
    //them more slippery. '0.3' is a good place to start but you might
    //need to modify this slightly depending on the exact behaviour
    //you want. Too little and the balls will feel sticky, too much
    //and they could start to jitter if they're jammed together
    var quantumPadding = 0.3;
    overlap += quantumPadding;

    //Normalize the vector
    //These numbers tell us the direction of the collision
    dx = vx / magnitude;
    dy = vy / magnitude;

    //Move circle 1 out of the collision by multiplying
    //the overlap with the normalized vector and subtract it from
    //circle 1's position
    c1.x -= overlap * dx;
    c1.y -= overlap * dy;

    //Bounce
    if (bounce) {
      //Create a collision vector object, `s` to represent the bounce 'surface'.
      //Find the bounce surface's x and y properties
      //(This represents the normal of the distance vector between the circles)
      s.x = vy;
      s.y = -vx;

      //Bounce c1 off the surface
      bounceOffSurface(c1, s);
    }
  }
  return hit;
}

/**
 * Use this to bounce an object off another object.
 * Parameters: 
 * * An object with `v.x` and `v.y` properties. This represents the object that is colliding 
 * with a surface.
 * * An object with `x` and `y` properties. This represents the surface that the object 
 * is colliding into.
 * 
 * The first object can optionally have a mass property that's greater than 1. The mass will 
 * be used to dampen the bounce effect.
 * @param {PIXI.Sprite} o 
 * @param {*} s 
 */
function bounceOffSurface(o, s) {
  if (!o._bumpPropertiesAdded) addCollisionProperties(o);

  var dp1,
    dp2,
    p1 = {},
    p2 = {},
    bounce = {},
    mass = o.mass || 1;

  //1. Calculate the collision surface's properties
  //Find the surface vector's left normal
  s.lx = s.y;
  s.ly = -s.x;

  //Find its magnitude
  s.magnitude = Math.sqrt(s.x * s.x + s.y * s.y);

  //Find its normalized values
  s.dx = s.x / s.magnitude;
  s.dy = s.y / s.magnitude;

  //2. Bounce the object (o) off the surface (s)

  //Find the dot product between the object and the surface
  dp1 = o.vx * s.dx + o.vy * s.dy;

  //Project the object's velocity onto the collision surface
  p1.vx = dp1 * s.dx;
  p1.vy = dp1 * s.dy;

  //Find the dot product of the object and the surface's left normal (s.lx and s.ly)
  dp2 = o.vx * (s.lx / s.magnitude) + o.vy * (s.ly / s.magnitude);

  //Project the object's velocity onto the surface's left normal
  p2.vx = dp2 * (s.lx / s.magnitude);
  p2.vy = dp2 * (s.ly / s.magnitude);

  //Reverse the projection on the surface's left normal
  p2.vx *= -1;
  p2.vy *= -1;

  //Add up the projections to create a new bounce vector
  bounce.x = p1.vx + p2.vx;
  bounce.y = p1.vy + p2.vy;

  //Assign the bounce vector to the object's velocity
  //with optional mass to dampen the effect
  o.vx = bounce.x / mass;
  o.vy = bounce.y / mass;
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
    if collision.has('left') console.log('The sprite hit the left');  
    if collision.has('top') console.log('The sprite hit the top');  
    if collision.has('right') console.log('The sprite hit the right');  
    if collision.has('bottom') console.log('The sprite hit the bottom');  
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
    collision.add('left');
  }

  //Top
  if (sprite.y - sprite.yAnchorOffset < container.y - sprite.parent.gy - container.yAnchorOffset) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = container.y - sprite.parent.gy - container.yAnchorOffset + sprite.yAnchorOffset;
    collision.add('top');
  }

  //Right
  if (sprite.x - sprite.xAnchorOffset + sprite.width > container.width - container.xAnchorOffset) {
    if (bounce) sprite.vx *= -1;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = container.width - sprite.width - container.xAnchorOffset + sprite.xAnchorOffset;
    collision.add('right');
  }

  //Bottom
  if (sprite.y - sprite.yAnchorOffset + sprite.height > container.height - container.yAnchorOffset) {
    if (bounce) sprite.vy *= -1;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = container.height - sprite.height - container.yAnchorOffset + sprite.yAnchorOffset;
    collision.add('bottom');
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
    Object.defineProperty(sprite, 'gx', {
      get: function() {
        return sprite.getGlobalPosition().x;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //gy
  if (sprite.gy === undefined) {
    Object.defineProperty(sprite, 'gy', {
      get: function() {
        return sprite.getGlobalPosition().y;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //centerX
  if (sprite.centerX === undefined) {
    Object.defineProperty(sprite, 'centerX', {
      get: function() {
        return sprite.x + sprite.width / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //centerY
  if (sprite.centerY === undefined) {
    Object.defineProperty(sprite, 'centerY', {
      get: function() {
        return sprite.y + sprite.height / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //halfWidth
  if (sprite.halfWidth === undefined) {
    Object.defineProperty(sprite, 'halfWidth', {
      get: function() {
        return sprite.width / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //halfHeight
  if (sprite.halfHeight === undefined) {
    Object.defineProperty(sprite, 'halfHeight', {
      get: function() {
        return sprite.height / 2;
      },
      enumerable: true,
      configurable: true,
    });
  }

  //xAnchorOffset
  if (sprite.xAnchorOffset === undefined) {
    Object.defineProperty(sprite, 'xAnchorOffset', {
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
    Object.defineProperty(sprite, 'yAnchorOffset', {
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
    Object.defineProperty(sprite, 'radius', {
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