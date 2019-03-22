import * as Utils from '../../../../src/lib/utils'

describe('animation: getTranslate3dPosition, should return translate3d position value, number', () => {
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
    const data = Utils.getTranslate3dPosition(1, { ...params, infinite: true, stagePadding: { paddingLeft: 1 } })
    expect(data).toEqual(-300)
  })
})
