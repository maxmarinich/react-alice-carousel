import * as Utils from '../../../../src/lib/utils'

describe('elements: isElement, return info is instance a valid html element, boolean', () => {
  const element = document.createElement('div')

  it('should return true', () => {
    expect(Utils.isElement(element)).toEqual(true)
  })

  it('should return false', () => {
    expect(Utils.isElement()).toEqual(false)
  })
})
