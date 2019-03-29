import * as Utils from '../../../../src/lib/utils'

describe('classnames: itemClassName: should return className, string', () => {
  const className = 'alice-carousel__stage-item'
  const activeClassName = ' __active'
  const clonedClassName = ' __cloned'
  const animatedClassName = ' animated animated-out fadeOut'
  const state = { items: 1, currentIndex: 1, slides: [1], infinite: false }

  it('should return default value', () => {
    const data = Utils.itemClassName()
    expect(data).toEqual(className)
  })

  it('should includes active class', () => {
    const data = Utils.itemClassName(2, state)
    expect(data.includes(activeClassName)).toEqual(true)
  })

  it('should includes cloned class', () => {
    const data = Utils.itemClassName(0, state)
    expect(data.includes(clonedClassName)).toEqual(true)
  })

  it('should`t includes cloned class', () => {
    const data = Utils.itemClassName(0, { ...state, infinite: true })
    expect(data.includes(clonedClassName)).toEqual(false)
  })

  it('should includes animated class', () => {
    const data = Utils.itemClassName(1, state, { allowFadeOutAnimation: true, fadeOutIndex: 1 })
    expect(data.includes(animatedClassName)).toEqual(true)
  })

  it('should`t includes animated class if allowFadeOutAnimation', () => {
    const data = Utils.itemClassName(1, state, { allowFadeOutAnimation: true, fadeOutIndex: 2 })
    expect(data.includes(animatedClassName)).toEqual(false)
  })

  it('should`t includes animated class if no allowFadeOutAnimation', () => {
    const data = Utils.itemClassName(1, state, { allowFadeOutAnimation: false, fadeOutIndex: 2 })
    expect(data.includes(animatedClassName)).toEqual(false)
  })
})
