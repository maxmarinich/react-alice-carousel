import * as Utils from '../../../app/components/utils'

describe('utils', () => {
  describe('animation', () => {
    const element = document.createElement('div')

    describe('animate: should update Element style properties, {}', () => {
      it('should return expected transform data', () => {
        Utils.animate(element)
        expect(element.style['transform']).toEqual('translate3d(0px, 0, 0)')
      })

      it('should return expected transform data with if translateX parameter: 100 ', () => {
        Utils.animate(element, 100)
        expect(element.style['transform']).toEqual('translate3d(100px, 0, 0)')
      })

      it('should return expected transition data if default duration', () => {
        Utils.animate(element)
        expect(element.style['transition']).toEqual('transform 0ms ease-out')
      })

      it('should return expected transition data if duration: 100', () => {
        Utils.animate(element, 0, 100)
        expect(element.style['transition']).toEqual('transform 100ms ease-out')
      })
    })

    describe('getTransformMatrix: should return matrix transformation data, []', () => {
      it('should return expected empty data if no element', () => {
        const data = Utils.getTransformMatrix()
        expect(data).toEqual([])
      })

      it('should return expected empty data if no transformation', () => {
        const element = document.createElement('div')
        const data = Utils.getTransformMatrix(element)
        expect(data).toEqual([])
      })
    })

    describe('getTranslate3dPosition: should return translate3d position value, number', () => {
      const params = { items: 1, itemWidth: 100 }

      it('should return default value if no params', () => {
        const data = Utils.getTranslate3dPosition()
        expect(data).toEqual(0)
      })

      it('should return expected value if not infinite', () => {
        const data = Utils.getTranslate3dPosition(1, params)
        expect(data).toEqual(-200)
      })

      it('should return expected value if infinite only', () => {
        const data = Utils.getTranslate3dPosition(1, { ...params, infinite: true })
        expect(data).toEqual(-200)
      })

      it('should return expected value if infinite && stage padding', () => {
        const data = Utils.getTranslate3dPosition(1, { ...params, infinite: true, stagePadding : {paddingLeft: 1 }})
        expect(data).toEqual(-300)
      })
    })

    describe('isAnimatedItem: should return flag, boolean', () => {
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
  })
})
