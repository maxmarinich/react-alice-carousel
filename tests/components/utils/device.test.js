import * as Utils from '../../../app/components/utils'

describe('utils', () => {
  describe('device', () => {
    const width = 1000
    const height = 200
    window.innerWidth = width
    window.innerHeight = height

    describe('deviceInfo, return info object, {}', () => {
      it('should return expected value', () => {
        expect(Utils.deviceInfo()).toEqual({ width, height })
      })
    })

    describe('shouldCallHandlerOnWindowResize, return flag, boolean', () => {
      it('should return expected false', () => {
        expect(Utils.shouldCallHandlerOnWindowResize({ width, height })).toEqual(false)
      })

      it('should return expected true', () => {
        expect(Utils.shouldCallHandlerOnWindowResize({})).toEqual(true)
      })
    })
  })
})
