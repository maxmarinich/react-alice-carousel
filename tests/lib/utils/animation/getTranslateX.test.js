import * as Utils from '../../../../src/lib/utils'

describe('animation: getTranslateX, should return translateX value, string', () => {
  document.body.innerHTML = '<div id="root">Root</div>'
  const element = document.getElementById('root')
  element.style.transform = '(0, 0, 0, 0, 11px)'

  it('should return expected data if no element', () => {
    expect(Utils.getTranslateX()).toEqual('')
  })

  it('should return expected data if element', () => {
    expect(Utils.getTranslateX(element)).toEqual('11')
  })
})
