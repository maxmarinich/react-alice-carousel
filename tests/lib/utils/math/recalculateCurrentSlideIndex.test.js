import * as Utils from '../../../../src/lib/utils'

describe('math: recalculateCurrentSlideIndex, return slide index, number', () => {
  it('should return default data', () => {
    const data = Utils.recalculateCurrentSlideIndex()
    expect(data).toEqual(0)
  })

  it('should return expected data if currentIndex less than 0', () => {
    const data = Utils.recalculateCurrentSlideIndex({ slides: [1, 2], currentIndex: -1 })
    expect(data).toEqual(1)
  })

  it('should return expected data if currentIndex equal 0', () => {
    const data = Utils.recalculateCurrentSlideIndex({ slides: [1, 2], currentIndex: 0 })
    expect(data).toEqual(0)
  })

  it('should return expected data if currentIndex more than 0', () => {
    const data = Utils.recalculateCurrentSlideIndex({ slides: [1, 2], currentIndex: 3 })
    expect(data).toEqual(0)
  })
})
