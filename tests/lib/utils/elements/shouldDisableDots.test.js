import * as Utils from '../../../../src/lib/utils'

describe('elements: shouldDisableDots, return boolean, false', () => {
  it('should return default value', () => {
    expect(Utils.shouldDisableDots()).toEqual(false)
  })

  it('should return expected value if `dotsDisabled`', () => {
    expect(Utils.shouldDisableDots({ dotsDisabled: true })).toEqual(true)
  })

  it('should return expected value if `controlsStrategy !== responsive`', () => {
    expect(Utils.shouldDisableDots({ controlsStrategy: 'non' })).toEqual(false)
  })

  it('should return expected value if `items !== slides.length`', () => {
    expect(Utils.shouldDisableDots({ controlsStrategy: 'responsive' }, { items: 2, slides: [] })).toEqual(false)
  })

  it('should return expected value if `controlsStrategy === responsive && items === responsive`', () => {
    expect(Utils.shouldDisableDots({ controlsStrategy: 'responsive' }, { items: 1, slides: [1] })).toEqual(true)
  })
})
