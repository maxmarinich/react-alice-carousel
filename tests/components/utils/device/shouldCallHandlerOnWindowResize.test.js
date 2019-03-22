import * as Utils from '../../../../src/lib/utils'

describe('device: shouldCallHandlerOnWindowResize, return flag, boolean', () => {
  const width = 1000
  const height = 200
  window.innerWidth = width
  window.innerHeight = height

  it('should return expected false', () => {
    expect(Utils.shouldCallHandlerOnWindowResize({ width, height })).toEqual(false)
  })

  it('should return expected true', () => {
    expect(Utils.shouldCallHandlerOnWindowResize({})).toEqual(true)
  })
})
