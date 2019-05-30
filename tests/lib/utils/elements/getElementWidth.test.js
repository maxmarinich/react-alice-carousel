import * as Utils from '../../../../src/lib/utils'

describe('elements: getElementWidth, return element width, number', () => {
  const element = document.createElement('div')

  it('should return expected value', () => {
    expect(Utils.getElementWidth(element)).toEqual(0)
  })

  it('should return undefined', () => {
    expect(Utils.getElementWidth()).toEqual(undefined)
  })
})
