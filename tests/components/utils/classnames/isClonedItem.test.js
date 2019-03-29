import * as Utils from '../../../../src/lib/utils'

describe('classnames: isClonedItem: should return flag, boolean', () => {
  const params = { items: 1, slides: [1], infinite: false }

  it('should return default value', () => {
    expect(Utils.isClonedItem()).toEqual(false)
  })

  it('should return false if infinite', () => {
    expect(Utils.isClonedItem({ ...params, infinite: true })).toEqual(false)
  })

  it('should return false if no value && no infinite', () => {
    expect(Utils.isClonedItem(params)).toEqual(false)
  })

  it('should return true if value:0 && no infinite', () => {
    expect(Utils.isClonedItem(0, params)).toEqual(true)
  })

  it('should return false if value:1 && no infinite', () => {
    expect(Utils.isClonedItem(1, params)).toEqual(false)
  })

  it('should return true if value:2 && no infinite', () => {
    expect(Utils.isClonedItem(2, params)).toEqual(true)
  })
})
