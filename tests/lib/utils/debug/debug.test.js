import * as Utils from '../../../../src/lib/utils'

describe('debug: debug', () => {
  const value = 1

  it('should return undefined', () => {
    expect(Utils.debug(value)).toEqual(undefined)
  })

  it('should return expected value', () => {
    window.__DEBUG__ = true
    expect(...Utils.debug(value)).toEqual(value)
  })
})
