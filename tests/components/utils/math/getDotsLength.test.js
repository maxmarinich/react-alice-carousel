import * as Utils from '../../../../src/lib/utils'

describe('math: getDotsLength, return dots length, number', () => {
  it('should return default data', () => {
    const data = Utils.getDotsLength()
    expect(data).toEqual(0)
  })

  it('should return expected data if remainder of division equal 0 && items equal slides', () => {
    const data = Utils.getDotsLength(1, 1)
    expect(data).toEqual(0)
  })

  it('should return expected data if remainder of division equal 0 && items less than slides', () => {
    const data = Utils.getDotsLength(4, 2)
    expect(data).toEqual(1)
  })

  it('should return expected data if remainder of division equal 0 && is not ceil value', () => {
    const data = Utils.getDotsLength(5, 2)
    expect(data).toEqual(2)
  })

  it('should return expected data if remainder of division not equal 0 && items more than slides', () => {
    const data = Utils.getDotsLength(5, 7)
    expect(data).toEqual(0)
  })

  it('should return expected data if remainder of division not equal 0 && items less than slides', () => {
    const data = Utils.getDotsLength(4, 3)
    expect(data).toEqual(1)
  })

  it('should return expected data if remainder of division not equal 0 && is not ceil value', () => {
    const data = Utils.getDotsLength(5, 2)
    expect(data).toEqual(2)
  })
})
