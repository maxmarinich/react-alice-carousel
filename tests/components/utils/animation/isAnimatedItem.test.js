import * as Utils from '../../../../src/lib/utils'

describe('animation: isAnimatedItem, should return flag, boolean', () => {
  const params = { allowFadeOutAnimation: true, fadeOutIndex: 0 }

  it('should return default value', () => {
    const data = Utils.isAnimatedItem()
    expect(data).toEqual(false)
  })

  it('should return false if no allowFadeOutAnimation', () => {
    const data = Utils.isAnimatedItem(0, {})
    expect(data).toEqual(false)
  })

  it('should return false if indexes are different', () => {
    const data = Utils.isAnimatedItem(1, params)
    expect(data).toEqual(false)
  })

  it('should return true if indexes are same', () => {
    const data = Utils.isAnimatedItem(0, params)
    expect(data).toEqual(true)
  })
})
