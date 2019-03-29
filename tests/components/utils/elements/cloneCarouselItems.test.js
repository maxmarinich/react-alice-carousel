import * as Utils from '../../../../src/lib/utils'

describe('elements: cloneCarouselItems, return cloned items, []', () => {
  const children = [1, 2, 3]
  const stagePadding = { paddingLeft: 10, paddingRight: 20 }

  it('should return default value', () => {
    expect(Utils.cloneCarouselItems()).toEqual([])
  })

  it('should return expected value if single children and not items', () => {
    expect(Utils.cloneCarouselItems([1])).toEqual([1, 1, 1])
  })

  it('should return expected value if children more than items', () => {
    expect(Utils.cloneCarouselItems(children, 2)).toEqual([2, 3, ...children, 1, 2])
  })

  it('should return expected value if children equal items', () => {
    expect(Utils.cloneCarouselItems(children, 3)).toEqual([...children, ...children, ...children])
  })

  it('should return expected value if children less than items', () => {
    expect(Utils.cloneCarouselItems(children, 4)).toEqual([...children, ...children, ...children])
  })

  it('should return expected value if infinite and not padding', () => {
    const data = Utils.cloneCarouselItems(children, 1, { infinite: true })
    expect(data).toEqual([3, ...children, 1])
  })

  it('should return expected value if infinite, padding and items less than children', () => {
    const data = Utils.cloneCarouselItems(children, 1, {
      stagePadding,
      infinite: true,
    })
    expect(data).toEqual([2, 3, ...children, 1, 2])
  })

  it('should return expected value if infinite, padding and items equal children', () => {
    const data = Utils.cloneCarouselItems(children, 3, {
      stagePadding,
      infinite: true,
    })
    expect(data).toEqual([3, ...children, ...children, ...children, 1])
  })

  it('should return expected value if infinite, padding and items more than children', () => {
    const data = Utils.cloneCarouselItems(children, 4, {
      stagePadding,
      infinite: true,
    })
    expect(data).toEqual([3, ...children, ...children, ...children, 1])
  })
})
