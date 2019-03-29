import * as Utils from '../../../../src/lib/utils'

describe('math: getSlideOffset, return slide offset, number', () => {
  it('should return default data', () => {
    const data = Utils.getSlideOffset()
    expect(data).toEqual(0)
  })

  it('should return expected data if no itemWidth and offset', () => {
    const data = Utils.getSlideOffset(undefined, 100)
    expect(data).toEqual(0)
  })

  it('should return expected data if itemWidth and default offset', () => {
    const data = Utils.getSlideOffset(100)
    expect(data).toEqual(50)
  })

  it('should return expected data if itemWidth more than default offset', () => {
    const data = Utils.getSlideOffset(600)
    expect(data).toEqual(250)
  })

  it('should return expected data if itemWidth more than offset', () => {
    const data = Utils.getSlideOffset(600, 100)
    expect(data).toEqual(100)
  })

  it('should return expected data if itemWidth less than offset', () => {
    const data = Utils.getSlideOffset(100, 200)
    expect(data).toEqual(50)
  })

  it('should return expected data if itemWidth equal offset', () => {
    const data = Utils.getSlideOffset(100, 100)
    expect(data).toEqual(50)
  })
})
