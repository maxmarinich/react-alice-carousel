/* global expect */
import * as Utils from '../../../../src/lib/utils'

describe('math: getItemIndexForDotNavigation, return index for dots, number', () => {
  it('should return default data', () => {
    const data = Utils.getItemIndexForDotNavigation()
    expect(data).toEqual(0)
  })

  it('should return expected data if isTheLastIndex', () => {
    const data = Utils.getItemIndexForDotNavigation(0, true, 5, 2)
    expect(data).toEqual(3)
  })

  it('should return expected data if is not isTheLastIndex', () => {
    const data = Utils.getItemIndexForDotNavigation(2, false, 5, 2)
    expect(data).toEqual(4)
  })
})
