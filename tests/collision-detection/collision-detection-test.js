import chai from 'chai'
import mocha from 'mocha'

import {
  hits,
  isAABBsOverlapped,
  EndPoint,
  sortAxis,
  getOverlapPairsEncoded,
  decodePairs,
} from '../../src/libs/collision-detection'


const { assert } = chai
const { describe, it, test } = mocha

// TODO: make "hits" function pure
describe('Collision detection test', function () {
  // it('should detect a collision when object moves from left to right', function () {
  //   const object = {
  //     x: 14,
  //     y: 10,
  //     vx: 1,
  //     vy: 0,
  //     width: 5,
  //     height: 5
  //   }
  //   const target = {
  //     width: 20,
  //     height: 20,
  //   }
  //   const contactPoint = hits(
  //     object,
  //     target
  //   )
  //
  //   assert.isNotNull(contactPoint)
  //   assert.equal(contactPoint, 19)
  // })
  //
  // it('should detect a collision when object moves from right to left', function () {
  //   assert.fail('Expected to fail')
  // })
  //
  // it('should detect a collision when object moves from top to bottom', function () {
  //   assert.fail('Expected to fail')
  // })
  //
  // it('should detect a collision when object moves from bottom to top', function () {
  //   assert.fail('Expected to fail')
  // })
})

describe('AABBs Overlap test', function () {
  it('should return false when just x-axis of AABBs intersect', function () {
    const aabb1 = {
      xBegin: EndPoint.create({ value: 5, box: null }),
      xEnd: EndPoint.create({ value: 20, box: null }),
      yBegin: EndPoint.create({ value: 10, box: null }),
      yEnd: EndPoint.create({ value: 20, box: null })
    }
    const aabb2 = {
      xBegin: EndPoint.create({ value: 10, box: null }),
      xEnd: EndPoint.create({ value: 15, box: null }),
      yBegin: EndPoint.create({ value: 30, box: null }),
      yEnd: EndPoint.create({ value: 40, box: null })
    }

    const actualResult = isAABBsOverlapped(aabb1, aabb2)
    const actualResult2 = isAABBsOverlapped(aabb2, aabb1)   // Also test for reverse position

    assert.equal(actualResult, false)
    assert.equal(actualResult2, false)
  })

  it('should return false when just y-axis of AABBs intersect', function () {
    const aabb1 = {
      xBegin: EndPoint.create({ value: 5, box: null }),
      xEnd: EndPoint.create({ value: 20, box: null }),
      yBegin: EndPoint.create({ value: 10, box: null }),
      yEnd: EndPoint.create({ value: 30, box: null })
    }
    const aabb2 = {
      xBegin: EndPoint.create({ value: 25, box: null }),
      xEnd: EndPoint.create({ value: 30, box: null }),
      yBegin: EndPoint.create({ value: 15, box: null }),
      yEnd: EndPoint.create({ value: 20, box: null })
    }
    const actualResult = isAABBsOverlapped(aabb1, aabb2)
    const actualResult2 = isAABBsOverlapped(aabb2, aabb1)   // Also test for reverse position

    assert.equal(actualResult, false)
    assert.equal(actualResult2, false)
  })

  it('should return true when and only when both axises of AABBs intersect', function () {
    const aabb1 = {
      xBegin: EndPoint.create({ value: 5, box: null }),
      xEnd: EndPoint.create({ value: 20, box: null }),
      yBegin: EndPoint.create({ value: 10, box: null }),
      yEnd: EndPoint.create({ value: 30, box: null })
    }
    const aabb2 = {
      xBegin: EndPoint.create({ value: 10, box: null }),
      xEnd: EndPoint.create({ value: 15, box: null }),
      yBegin: EndPoint.create({ value: 15, box: null }),
      yEnd: EndPoint.create({ value: 20, box: null })
    }
    const actualResult = isAABBsOverlapped(aabb1, aabb2)
    const actualResult2 = isAABBsOverlapped(aabb2, aabb1)   // Also test for reverse position

    assert.equal(actualResult, true)
    assert.equal(actualResult2, true)
  })

  // TODO: write tests for different kinds of overlap, e.g: A contains B
})

describe('Sort endpoints test', function () {
  it('should always return a sorted list of endpoints', function () {
    const endPoints = [
      EndPoint.create({ value: 3, box: null }),
      EndPoint.create({ value: 1, box: null }),
      EndPoint.create({ value: 5, box: null }),
      EndPoint.create({ value: 2, box: null }),
    ]
    sortAxis(endPoints)

    assert.ok(endPoints[0].value < endPoints [1].value)
    assert.ok(endPoints[1].value < endPoints [2].value)
    assert.ok(endPoints[2].value < endPoints [3].value)
  })

  it('should report endpoints', function () {
    const boxes = []
    const aabb1 = {}
    boxes.push(aabb1)
    aabb1.index = boxes.length - 1

    const x1Begin = EndPoint.create({ value: 5, isBegin: true })
    const x1End = EndPoint.create({ value: 20, isBegin: false })
    const y1Begin = EndPoint.create({ value: 10, isBegin: true })
    const y1End = EndPoint.create({ value: 20, isBegin: false })

    aabb1.xBegin = x1Begin
    aabb1.xEnd = x1End
    aabb1.yBegin = y1Begin
    aabb1.yEnd = y1End
    x1Begin.box = x1End.box = y1Begin.box = y1End.box = aabb1


    const aabb2 = {}
    boxes.push(aabb2)
    aabb2.index = boxes.length - 1

    const x2Begin = EndPoint.create({ value: 10, isBegin: true })
    const x2End =  EndPoint.create({ value: 15, isBegin: false })
    const y2Begin = EndPoint.create({ value: 15, isBegin: true })
    const y2End = EndPoint.create({ value: 20, isBegin: false })

    aabb2.xBegin = x2Begin
    aabb2.xEnd = x2End
    aabb2.yBegin = y2Begin
    aabb2.yEnd = y2End
    x2Begin.box = x2End.box = y2Begin.box = y2End.box = aabb2

    const overlapPairs = new Set()
    const xAxisEndPoints = [
      aabb1.xBegin,
      aabb1.xEnd,
      aabb2.xBegin,
      aabb2.xEnd,
    ]
    sortAxis(xAxisEndPoints, overlapPairs)

    assert.ok(xAxisEndPoints[0].value < xAxisEndPoints [1].value)
    assert.ok(xAxisEndPoints[1].value < xAxisEndPoints [2].value)
    assert.ok(xAxisEndPoints[2].value < xAxisEndPoints [3].value)
    assert.ok(overlapPairs.size === 1, 'We have 2 boxes overlap, therefore should have 1 pair')
    assert.ok(overlapPairs.has(2), 'Encoded number of indices [0,1] should be 2')

    const yAxisEndPoints = [
      aabb1.yBegin,
      aabb1.yEnd,
      aabb2.yBegin,
      aabb2.yEnd,
    ]
    sortAxis(yAxisEndPoints, overlapPairs)

    assert.ok(yAxisEndPoints[0].value <= yAxisEndPoints [1].value)
    assert.ok(yAxisEndPoints[1].value <= yAxisEndPoints [2].value)
    assert.ok(yAxisEndPoints[2].value <= yAxisEndPoints [3].value)
    assert.ok(overlapPairs.size === 1, 'We have 2 boxes overlap, therefore should have 1 pair')
    assert.ok(overlapPairs.has(2))
  })
})

// cantor function
// Cantor(k1, k2) = (k1 + k2) * (k1 + k2 + 1) / 2   + k2
// Cantor(k1, k2) = Cantor(k2, 1)
// k1, k2 >= 0
// k1, k2 belongs to N
describe('Get a unique encoded value of 2 values', function () {
  it('should return the same number no matter indices order', function () {
    const result1 = getOverlapPairsEncoded(1,3)
    const result2 = getOverlapPairsEncoded(3, 1)

    assert.equal(result1, 13)
    assert.equal(result2, 13)
  })

  it(`should produce the same number
      no matter how many times function called with same arguments`,
    function () {
      const result = getOverlapPairsEncoded(5, 5)
      const result1 = getOverlapPairsEncoded(5, 5)
      const result2 = getOverlapPairsEncoded(5, 5)

      assert.equal(result, 60)
      assert.equal(result1, 60)
      assert.equal(result2, 60)
    }
  )

  // TODO: write test cases for negative number, error handler
})

describe('Decode pair number to indices', function () {
  it('should return 2 indices', function () {
    const encodedNumber = 13
    const [index1, index2] = decodePairs(encodedNumber)
    assert.equal(index1, 1, 'First index should be 1')
    assert.equal(index2, 3, 'Second index should be 3')
  })
})
