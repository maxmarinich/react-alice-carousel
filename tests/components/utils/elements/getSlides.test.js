import * as Utils from '../../../../app/lib/utils'

describe('elements: getSlides, return gallery items, []', () => {
  it('should return expected value', () => {
    expect(Utils.getSlides()).toEqual([])
  })

  it('should return expected value if slides length', () => {
    expect(Utils.getSlides({ children: [1], items: [2] })).toEqual([1])
  })
})
