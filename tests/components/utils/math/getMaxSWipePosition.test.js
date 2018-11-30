import * as Utils from '../../../../app/components/utils'

describe('math: getMaxSWipePosition, return max swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.getMaxSWipePosition()
    expect(data).toEqual(0)
  })

  it('should return expected data', () => {
    const data = Utils.getMaxSWipePosition(1, 100, 1)
    expect(data).toEqual(200)
  })
})
