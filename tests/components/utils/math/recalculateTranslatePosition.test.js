import * as Utils from '../../../../src/lib/utils'

describe('math: recalculateTranslatePosition, return translate position, number', () => {
  const state = { currentIndex: 1, items: 1, itemWidth: 100, stagePadding: {}, slides: [1, 2, 3] }
  it('should return default data', () => {
    const data = Utils.recalculateTranslatePosition()
    expect(data).toEqual(0)
  })

  it('should return expected data in case 1', () => {
    const data = Utils.recalculateTranslatePosition(state)
    expect(data).toEqual(-100)
  })

  it('should return expected data in case 2', () => {
    const data = Utils.recalculateTranslatePosition({ ...state, currentIndex: -1 })
    expect(data).toEqual(-300)
  })

  it('should return expected data in case 3', () => {
    const data = Utils.recalculateTranslatePosition({ ...state, stagePadding: { paddingLeft: 1 } })
    expect(data).toEqual(-200)
  })

  it('should return expected data in case 4', () => {
    const data = Utils.recalculateTranslatePosition({ ...state, stagePadding: { paddingLeft: 1 }, currentIndex: -1 })
    expect(data).toEqual(-400)
  })
})
