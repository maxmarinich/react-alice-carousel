import * as Utils from '../../../../app/components/utils'

describe('math: geTranslateLimit, return swipe position, number', () => {
  it('should return default data', () => {
    const data = Utils.geTranslateLimit()
    expect(data).toEqual(0)
  })

  it('should return expected data if no items', () => {
    const data = Utils.geTranslateLimit(undefined, 5)
    expect(data).toEqual(0)
  })

  it('should return expected data if no itemWidth', () => {
    const data = Utils.geTranslateLimit(5)
    expect(data).toEqual(0)
  })

  it('should return expected data if items and if itemWidth', () => {
    const data = Utils.geTranslateLimit(2, 100)
    expect(data).toEqual(150)
  })

  it('should return expected data if items and if big itemWidth', () => {
    const data = Utils.geTranslateLimit(2, 1000)
    expect(data).toEqual(1750)
  })
})
