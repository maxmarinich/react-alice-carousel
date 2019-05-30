import * as Utils from '../../../../src/lib/utils'

describe('math: getMaxSwipePosition, return max swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.getMaxSwipePosition()
    expect(data).toEqual(0)
  })

  it('should return expected data', () => {
    const data = Utils.getMaxSwipePosition(1, 100, 1)
    expect(data).toEqual(200)
  })
})
