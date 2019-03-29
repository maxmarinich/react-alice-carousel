import * as Utils from '../../../../src/lib/utils'

describe('elements: getSlideInfo, return slide info, {}', () => {
  it('should return default value', () => {
    expect(Utils.getSlideInfo()).toEqual({ slideIndex: 1, slidesLength: 0 })
  })

  it('should return expected value if index less than 0', () => {
    expect(Utils.getSlideInfo(-1, 2)).toEqual({
      slideIndex: 2,
      slidesLength: 2,
    })
  })

  it('should return expected value if index more than slides length', () => {
    expect(Utils.getSlideInfo(5, 2)).toEqual({
      slideIndex: 1,
      slidesLength: 2,
    })
  })

  it('should return expected value if index less than slides length', () => {
    expect(Utils.getSlideInfo(1, 2)).toEqual({
      slideIndex: 2,
      slidesLength: 2,
    })
  })

  it('should return expected value if index equal slides length', () => {
    expect(Utils.getSlideInfo(2, 2)).toEqual({
      slideIndex: 1,
      slidesLength: 2,
    })
  })
})
