import * as Utils from '../../../app/components/utils'

describe('utils', () => {
  describe('classnames', () => {
    describe('isActiveItem: should return flag, boolean', () => {
      const params = { currentIndex: 1, items: 1 }
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
        expect(Utils.isActiveItem(3, { ...params, stagePadding })).toEqual(true)
      })
    })

    describe('isClonedItem: should return flag, boolean', () => {
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

    describe('itemClassName: should return className, string', () => {
      const className = 'alice-carousel__stage-item'
      const activeClassName = ' __active'
      const clonedClassName = ' __cloned'
      const animatedClassName = ' animated animated-out fadeOut'
      const state = { items: 1, currentIndex: 1 , slides: [1], infinite: false }

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
  })
})
