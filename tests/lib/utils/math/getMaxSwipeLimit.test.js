import * as Utils from '../../../../src/lib/utils'

describe('math: getMaxSwipeLimit, return max swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.getMaxSwipeLimit()
    expect(data).toEqual(0)
  })

  it('should return expected data if paddingRight', () => {
    const data = Utils.getMaxSwipeLimit(100, { paddingRight: 50 })
    expect(data).toEqual(100)
  })

  it('should return expected data if no paddingRight', () => {
    const data = Utils.getMaxSwipeLimit(100)
    expect(data).toEqual(100)
  })
})
