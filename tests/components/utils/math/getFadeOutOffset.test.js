import * as Utils from '../../../../src/lib/utils'

describe('math: getFadeOutOffsetOnDotClick, return start index, number', () => {
  it('should return default data', () => {
    const data = Utils.getFadeOutOffsetOnDotClick()
    expect(data).toEqual(0)
  })

  it('should return expected data if itemIndex less currentIndex and case 1', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(0, 1)
    expect(data).toEqual(0)
  })

  it('should return expected data if itemIndex less currentIndex and case 2', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(0, 1, 100)
    expect(data).toEqual(-100)
  })

  it('should return expected data if itemIndex not less currentIndex and case 1', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(1, 0, 100)
    expect(data).toEqual(100)
  })

  it('should return expected data if itemIndex not less currentIndex and case 2', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(0, 0, 100)
    expect(data).toEqual(0)
  })

  it('should return expected data if itemIndex not less currentIndex and case 3', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(0, 2, 100)
    expect(data).toEqual(-200)
  })

  it('should return expected data if itemIndex not less currentIndex and case 4', () => {
    const data = Utils.getFadeOutOffsetOnDotClick(0, -1, 100)
    expect(data).toEqual(100)
  })
})
