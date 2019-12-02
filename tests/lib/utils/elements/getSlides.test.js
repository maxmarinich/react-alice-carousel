import * as Utils from '../../../../src/lib/utils'

export const getSlides = (props) => {
  const { children, items = [] } = props || {}

  if (children && children.length) {
    return children
  }

  return items
}

describe('elements: getSlides, return gallery items, []', () => {
  it('should return expected value', () => {
    expect(Utils.getSlides()).toEqual([])
  })

  it('should return expected value if slides length', () => {
    expect(Utils.getSlides({ children: [1], items: 1 })).toEqual([1])
  })

  it('should return expected value if not slides length', () => {
    expect(Utils.getSlides({ children: [], items: 2 })).toEqual(2)
  })

  it('should return expected value if no items length', () => {
    expect(Utils.getSlides({ children: null, items: 1 })).toEqual(1)
  })
})
