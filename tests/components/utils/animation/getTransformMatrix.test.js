import * as Utils from '../../../../src/lib/utils'

describe('animation: getTransformMatrix, should return matrix transformation data, []', () => {
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
