import * as Utils from '../../../../src/lib/utils'

describe('elements: getItemWidth, return gallery item width, number', () => {
  it('should return default value', () => {
    expect(Utils.getItemWidth()).toEqual(0)
  })

  it('should return expected value if items equal 0 ', () => {
    expect(Utils.getItemWidth()).toEqual(0)
  })

  it('should return expected value if items more than 0 ', () => {
    expect(Utils.getItemWidth(10, 2)).toEqual(5)
  })
})
