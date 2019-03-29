import * as Utils from '../../../../src/lib/utils'

describe('elements: itemInfo, return item info, {}', () => {
  it('should return default value', () => {
    expect(Utils.itemInfo()).toEqual({
      isPrevSlideDisabled: false,
      isNextSlideDisabled: false,
    })
  })

  it('should return expected value if infinite not equal false', () => {
    const data = Utils.itemInfo({ items: 1, currentIndex: 1, slides: [] })
    expect(data).toEqual({ isPrevSlideDisabled: false, isNextSlideDisabled: false })
  })

  it('should return expected value if infinite equal false && currentIndex equal 0', () => {
    const data = Utils.itemInfo({ infinite: false, currentIndex: 0 })
    expect(data).toEqual({ isPrevSlideDisabled: true, isNextSlideDisabled: false })
  })

  it('should return expected value if infinite equal false, currentIndex not equal 0', () => {
    const params = { items: 1, infinite: false, currentIndex: 1, slides: [1, 3] }
    const data = Utils.itemInfo(params)
    expect(data).toEqual({ isPrevSlideDisabled: false, isNextSlideDisabled: true })
  })

  it('should return expected value if infinite equal false, slides minus items equal currentIndex', () => {
    const params = { items: 3, infinite: false, currentIndex: 0, slides: [1, 2, 3] }
    const data = Utils.itemInfo(params)
    expect(data).toEqual({ isPrevSlideDisabled: true, isNextSlideDisabled: true })
  })

  it('should return expected value if infinite equal false, slides minus items not equal currentIndex', () => {
    const params = { items: 2, infinite: false, currentIndex: 0, slides: [1, 2, 3] }
    const data = Utils.itemInfo(params)
    expect(data).toEqual({ isPrevSlideDisabled: true, isNextSlideDisabled: false })
  })
})
