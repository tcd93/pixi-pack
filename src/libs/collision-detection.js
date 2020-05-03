// Objects are always contained in bounding
// Only needs to check container width
// Use relative coords of objects to container
// Delta x: the distance in x axis of which the object is about to move
// Positive dx: x moves from left to right
// Negative dx: x moves from right to left
// Delta y: the distance in y axis of which the object is about to move
// Positive dy: y moves from top to bottom
// Negative dy: y moves from bottom to top

// Using velocity as moving distance
// Return contact point with its current velocity


// From left to right
// when object.x + object.width >= bounding.width

// From right to left
// When object.x <= 0

// From top to bottom
// When object.y + height >= bounding.height

// From bottom to top
// When object.y <= 0

/***
 * object: Sprite that has x,y
 * target: the bounding box that contains object
 * aware of time
 * fixed steps
 * */
// TODO: add anchorOffset in case of setting custom origin
// TODO: make "hits" function pure
function hits(object, target, options = {}) {
  const {
    x = 0,
    y = 0,
    vx = 0,
    vy = 0,
  } = object
  const {
      bounce
  } = options

  if (vx < 0 && x + vx <= 0) {
    object.vx = Math.max(vx, -x)
    console.log('left collision detected', object.x)
    // only bounce when vx <= 1
    // if (bounce && Math.abs(object.vx) <= 1) object.vx = -object.vx
  }

  if (vx > 0 && x + vx + object.width >= target.width - 1) {
    console.log('Before correction', vx)
    console.log(target.width, x, object.width)
    object.vx = Math.min(vx, target.width - (x + object.width) - 1)
    console.log('right collision detected', object.x, object.vx)
  }

  if (vy > 0 && y + vy + object.height >= target.height -1) {
    object.vy = Math.min(vy, target.height - (y + object.height) - 1)
  }

  if (vy < 0 && y + vy <= 0) {
    object.vy = Math.max(vy, -y)
  }
}

// Return [m,n]
function getCurrentXAxisProjection(object) {
  return [object.x, object.x + object.width]
}

// Return [x,y]
function getCurrentYAxisProjection(object) {
  return [object.y, object.y + object.height]
}

// Example: 2 objects with their x projection [m,n] [x,y]
// AABBs do not intersect when
// m > y
// x > n
// or with their y projection [j,k] [o,p]
// j > p
// o > k
function isAABBsOverlapped(aabb1, aabb2) {
  const {
    xBegin: x1Begin,
    xEnd: x1End,
    yBegin: y1Begin,
    yEnd: y1End,
  } = aabb1
  const {
    xBegin: x2Begin,
    xEnd: x2End,
    yBegin: y2Begin,
    yEnd: y2End,
  } = aabb2

  // Reverse logic of not intersecting
  return !(
    x1Begin.value > x2End.value
    || x2Begin.value > x1End.value
    || y1Begin.value > y2End.value
    || y2Begin.value > y1End.value
  )
}

// Represents a point in space and has a reference to its parent box
const EndPoint = {
  value: null,
  box: null,
  isBegin: true,

  create({ value, box, isBegin }) {
    return Object.create(
      this,
      {
        value: { value },
        box: { value: box, writable: true },
        isBegin: { value: isBegin !== undefined ? isBegin : this.isBegin }
      }
    )
  }
}

const Box = {
  indexOfStartPoint: null,
  indexOfStopPoint: null,

  create() {
    return Object.create(this)
  }
}


// Each item could be a sprite and an object with geometry data
const sprite1 = {
  x: 10, // start x: 10
  width: 20, // stop x: x + width = 30

}
const sprite2 = {}
const sprite3 = {}
const sprite4 = {}
const sprite5 = {}

const boxes = [
  sprite1,
  sprite2,
  sprite3,
  sprite4,
  sprite5,
].map(sprite => Box.create())

const xAxisEndPoints = []
const yAxisEndPoints = []

function sortAxis(endPoints, overlapPairs = new Set()) {
  if (!endPoints) return

  // When endPoints list has only 1 item, it's "sorted"
  if (endPoints.length === 1) return endPoints

  // TODO: optimize using sentinels
  for (let i = 1; i < endPoints.length; i++) {
    const endPointToSort = endPoints[i]

    let j = i - 1
    // When ever there is a swap, it means there is overlap possibility
    while (j >= 0 && endPoints[j].value > endPointToSort.value) {
      let swap = endPoints[j]

      // Because the swap object
      // When swap.max > aabb.min, it means that the object (aabb) is moving into
      // each other, a possible collapse
      // Do a full check
      if (endPointToSort.isBegin && !swap.isBegin) {
        if (isAABBsOverlapped(endPointToSort.box, swap.box)) {
          overlapPairs
            .add(endPointToSort.box)
            .add(swap.box)
        }
      }

      // When swap.min > aabb.max, two objects are moving away from each other
      // We can be sure that they are not overlapped
      if (!endPointToSort.isBegin && swap.isBegin) {
        overlapPairs
          .remove(endPointToSort.box)
          .remove(swap.box)
      }

      endPoints[j+1] = swap
      j--
    }

    endPoints[j+1] = endPointToSort
  }
}

function getOverlapPairs(endPoints) {

}

export {
  hits,
  isAABBsOverlapped,
  EndPoint,
  sortAxis,
}
