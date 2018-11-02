import * as Utils from '../../../app/components/utils'

describe('utils', () => {
  describe('animation', () => {
    const element = document.createElement('div')

    describe('animate: should update Element style properties, {}', () => {
      it('should return expected transform data', () => {
        Utils.animate(element)
        expect(element.style['transform']).toEqual('translate3d(0px, 0, 0)')
      })

      it('should return expected transform data', () => {
        Utils.animate(element, 100)
        expect(element.style['transform']).toEqual('translate3d(100px, 0, 0)')
      })

      it('should return expected transition data', () => {
        Utils.animate(element)
        expect(element.style['transition']).toEqual('transform 0ms ease-out')
      })

      it('should return expected transition data', () => {
        Utils.animate(element, 0, 100)
        expect(element.style['transition']).toEqual('transform 100ms ease-out')
      })
    })
  })
})
