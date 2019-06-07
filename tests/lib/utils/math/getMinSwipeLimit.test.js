/* global expect */
import * as Utils from '../../../../src/lib/utils'

describe('math: getMinSwipeLimit, return min swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.getMinSwipeLimit()
    expect(data).toEqual(0)
  })

  it('should return expected data if no paddingLeft', () => {
    const data = Utils.getMinSwipeLimit(100)
    expect(data).toEqual(0)
  })

  it('should return expected data if paddingLeft', () => {
    const data = Utils.getMinSwipeLimit(undefined,{ paddingLeft: 50 })
    expect(data).toEqual(0)
  })
})
