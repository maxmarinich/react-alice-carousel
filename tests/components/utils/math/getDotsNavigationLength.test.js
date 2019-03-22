import * as Utils from '../../../../src/lib/utils'

describe('math: getDotsNavigationLength, return length of dots navigation, number', () => {
  it('should return default data', () => {
    const data = Utils.getDotsNavigationLength()
    expect(data).toEqual(0)
  })

  it('should return expected data if length equal 0', () => {
    const data = Utils.getDotsNavigationLength(0, 5)
    expect(data).toEqual(0)
  })

  it('should return expected data if items equal 0', () => {
    const data = Utils.getDotsNavigationLength(1, 0)
    expect(data).toEqual(0)
  })

  it('should return expected data if length && items not equal 0', () => {
    const data = Utils.getDotsNavigationLength(5, 5)
    expect(data).toEqual(1)
  })

  it('should return expected data if length more than items', () => {
    const data = Utils.getDotsNavigationLength(5, 2)
    expect(data).toEqual(3)
  })

  it('should return expected data if length less than items', () => {
    const data = Utils.getDotsNavigationLength(2, 5)
    expect(data).toEqual(1)
  })
})
