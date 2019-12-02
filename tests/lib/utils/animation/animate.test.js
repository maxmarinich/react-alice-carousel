import * as Utils from '../../../../src/lib/utils'

describe('animation: animate, should update Element style properties, {}', () => {
  const element = document.createElement('div')

  it('should return default data', () => {
    Utils.animate()
    expect(element.style['transform']).toEqual('')
  })

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
