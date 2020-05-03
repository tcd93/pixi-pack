import chai from 'chai'
import mocha from 'mocha'

import {
  hits,
  isAABBsOverlapped,
  EndPoint,
  sortAxis,
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
    const aabb1 = {}
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
    assert.ok(overlapPairs.size === 2)
    assert.ok(overlapPairs.has(aabb1))
    assert.ok(overlapPairs.has(aabb1))

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
    assert.ok(overlapPairs.size === 2)
    assert.ok(overlapPairs.has(aabb1))
    assert.ok(overlapPairs.has(aabb1))

  })
})
