import * as Utils from '../../../../src/lib/utils'

describe('elements: getElementDimensions, return element width, number', () => {
  const element = document.createElement('div')

  it('should return expected value', () => {
    const { width, height } = Utils.getElementDimensions(element)
    expect(width).toEqual(0)
    expect(height).toEqual(0)
  })

  it('should return undefined', () => {
    const { width, height } = Utils.getElementDimensions()

    expect(width).toEqual(undefined)
    expect(height).toEqual(undefined)
  })
})
