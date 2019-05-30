import * as Utils from '../../../../src/lib/utils'

describe('classnames: isActiveItem, should return flag, boolean', () => {
  const params = { currentIndex: 1, items: 1, infinite: true }
  const stagePadding = { paddingLeft: 1 }

  it('should return default value', () => {
    expect(Utils.isActiveItem()).toEqual(false)
  })

  it('should return expected data if some value && no stage padding', () => {
    expect(Utils.isActiveItem(0, params)).toEqual(false)
  })

  it('should return expected data if expected value && no stage padding', () => {
    expect(Utils.isActiveItem(2, params)).toEqual(true)
  })

  it('should return expected data if some value && stage padding', () => {
    expect(Utils.isActiveItem(0, { ...params, stagePadding })).toEqual(false)
  })

  it('should return expected data if expected value && stage padding', () => {
    expect(Utils.isActiveItem(4, { ...params, items: 2, stagePadding })).toEqual(true)
  })

  it('should return expected data if expected value && stage padding and index equal 5', () => {
    expect(Utils.isActiveItem(5, { ...params, items: 2, stagePadding })).toEqual(true)
  })

  it('should return expected data if expected value && stage padding and index equal 6', () => {
    expect(Utils.isActiveItem(6, { ...params, items: 2, stagePadding })).toEqual(false)
  })
})
