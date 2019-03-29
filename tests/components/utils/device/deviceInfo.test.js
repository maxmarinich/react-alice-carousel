import * as Utils from '../../../../src/lib/utils'

describe('device: deviceInfo, return info object, {}', () => {
  const width = 1000
  const height = 200
  window.innerWidth = width
  window.innerHeight = height

  it('should return expected value', () => {
    expect(Utils.deviceInfo()).toEqual({ width, height })
  })
})
