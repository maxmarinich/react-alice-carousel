/* global expect */
import * as Utils from '../../../../src/lib/utils'

describe('math: getMinSwipeLimitIfNotInfinite, return max swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.getMinSwipeLimitIfNotInfinite(5)
    expect(data).toEqual(0)
  })
  it('should return expected data', () => {
    const data = Utils.getMinSwipeLimitIfNotInfinite(5,20)
    expect(data).toEqual(90)
  })
})
