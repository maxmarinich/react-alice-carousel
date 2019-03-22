import * as Utils from '../../../../src/lib/utils'

describe('math: getActiveSlideIndex, return current slide`s index, number', () => {
  it('should return default data', () => {
    const data = Utils.getActiveSlideIndex()
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisabled, items equal 1 && currentIndex less than items', () => {
    const props = { currentIndex: -1, items: 1, slides: [1, 2, 3] }
    const data = Utils.getActiveSlideIndex(true, props)
    expect(data).toEqual(2)
  })

  it('should return expected data if isNextSlideDisabled, items equal 1 && currentIndex more than slidesLength', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2] }
    const data = Utils.getActiveSlideIndex(true, props)
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisabled, items equal 1 && currentIndex not more than slidesLength', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2, 3, 4] }
    const data = Utils.getActiveSlideIndex(true, props)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 1 && currentIndex less than items', () => {
    const props = { currentIndex: -1, items: 1, slides: [1, 2, 3] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 1 && currentIndex more than slidesLength', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 1 && currentIndex not more than slidesLength', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2, 3, 4] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(2)
  })

  it('should return expected data if isNextSlideDisabled, items not equal 1 and case 1', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2] }
    const data = Utils.getActiveSlideIndex(true, props)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisabled, items not equal 1 and case 1', () => {
    const props = { currentIndex: 2, items: 1, slides: [1, 2] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisabled, items not equal 1 and case 2', () => {
    const props = { currentIndex: 1, items: 2, slides: [1, 2, 3, 4, 5] }
    const data = Utils.getActiveSlideIndex(true, props)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled, currentIndex equal 0 and case 1', () => {
    const props = { currentIndex: -1, items: 1, slides: [1, 2] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(1)
  })

  it('should return expected data if not isNextSlideDisabled, currentIndex equal 0 and case 2', () => {
    const props = { currentIndex: -3, items: 3, slides: [1, 2, 3, 4] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 0', () => {
    const props = { currentIndex: 1, items: 0, slides: [1, 2, 3, 4] }
    const data = Utils.getActiveSlideIndex(false, props)
    expect(data).toEqual(0)
  })
})
