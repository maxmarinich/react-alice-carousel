import * as Utils from '../../../../app/components/utils'

describe('math: getActiveSlideIndex, return current slide`s index, number', () => {
  it('should return default data', () => {
    const data = Utils.getActiveSlideIndex()
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisabled, items equal 1 && currentIndex less than items', () => {
    const data = Utils.getActiveSlideIndex(true, -1, 1, 3)
    expect(data).toEqual(2)
  })

  it('should return expected data if isNextSlideDisabled items equal 1 && currentIndex more than slidesLength', () => {
    const data = Utils.getActiveSlideIndex(true, 2, 1, 2)
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisableditems equal 1 && currentIndex not more than slidesLength', () => {
    const data = Utils.getActiveSlideIndex(true, 2, 1, 4)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 1 && currentIndex less than items', () => {
    const data = Utils.getActiveSlideIndex(false, -1, 1, 3)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled items equal 1 && currentIndex more than slidesLength', () => {
    const data = Utils.getActiveSlideIndex(false, 2, 1, 2)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisableditems equal 1 && currentIndex not more than slidesLength', () => {
    const data = Utils.getActiveSlideIndex(false, 2, 1, 4)
    expect(data).toEqual(2)
  })

  it('should return expected data if isNextSlideDisabled, items not equal 1 and case 1', () => {
    const data = Utils.getActiveSlideIndex(true, 2, 1, 2)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisabled, items not equal 1 and case 1', () => {
    const data = Utils.getActiveSlideIndex(false, 2, 1, 2)
    expect(data).toEqual(0)
  })

  it('should return expected data if isNextSlideDisabled, items not equal 1 and case 2', () => {
    const data = Utils.getActiveSlideIndex(true, 1, 2, 5)
    expect(data).toEqual(2)
  })

  it('should return expected data if not isNextSlideDisabled, currentIndex equal 0 and case 1', () => {
    const data = Utils.getActiveSlideIndex(false, -1, 1, 2)
    expect(data).toEqual(1)
  })

  it('should return expected data if not isNextSlideDisabled, currentIndex equal 0 and case 2', () => {
    const data = Utils.getActiveSlideIndex(false, -3, 3, 4)
    expect(data).toEqual(0)
  })

  it('should return expected data if not isNextSlideDisabled, items equal 0', () => {
    const data = Utils.getActiveSlideIndex(false, 1, 0, 4)
    expect(data).toEqual(0)
  })
})
