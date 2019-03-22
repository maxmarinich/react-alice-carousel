import * as Utils from '../../../../src/lib/utils'

describe('elements: getNextItemIndexBeforeTouchEnd, return item info, {}', () => {
  const position = 300
  const stagePadding = { paddingLeft: 1, paddingRight: 1 }
  const params = { itemWidth: 100, items: 1, infinite: true, slides: [1, 2, 3] }

  it('should return default data  if itemWidth equal 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { itemWidth: 0 })
    expect(data).toEqual(0)
  })

  it('should return default data if items greater than slides', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 4 })
    expect(data).toEqual(0)
  })

  it('should return expected data if infinite && not stage adding', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, params)
    expect(data).toEqual(2)
  })

  it('should return expected data if infinite && stage adding', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding })
    expect(data).toEqual(1)
  })

  it('should return expected data if infinite, stage padding && index equal slides', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, slides: [1] })
    expect(data).toEqual(0)
  })

  it('should return expected data if infinite, stage padding && index less than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 3 })
    expect(data).toEqual(2)
  })

  it('should return expected data if infinite, stage padding && index equal 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 2 })
    expect(data).toEqual(0)
  })

  it('should return expected data if infinite, stage padding && index more than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, stagePadding, items: 1 })
    expect(data).toEqual(1)
  })

  it('should return expected data if infinite, not stage padding && index equal slides', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(400, params)
    expect(data).toEqual(0)
  })

  it('should return expected data if infinite, not stage padding && index not equal slides', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, params)
    expect(data).toEqual(2)
  })

  it('should return expected data if infinite, not stage padding && index equal 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 3 })
    expect(data).toEqual(0)
  })

  it('should return expected data if infinite, not stage padding && index more than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(position, { ...params, items: 2 })
    expect(data).toEqual(1)
  })

  it('should return expected data if infinite, not stage padding && index less than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, items: 2 })
    expect(data).toEqual(2)
  })

  it('should return expected data if not infinite && index equal slides', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(200, { ...params, items: 1, slides: [1] })
    expect(data).toEqual(0)
  })

  it('should return expected data if not infinite && index less than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, items: 2, slides: [1, 2] })
    expect(data).toEqual(1)
  })

  it('should return expected data if not infinite && index more than 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(200, { ...params, slides: [1, 2] })
    expect(data).toEqual(1)
  })

  it('should return expected data if not infinite && index equal 0', () => {
    const data = Utils.getNextItemIndexBeforeTouchEnd(100, { ...params, slides: [1, 2] })
    expect(data).toEqual(0)
  })
})
