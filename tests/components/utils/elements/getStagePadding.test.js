import * as Utils from '../../../../src/lib/utils'

describe('elements: getStagePadding, return plan object, {}', () => {
  const stagePadding = { paddingLeft: 10, paddingRight: 20 }

  it('should return default value', () => {
    expect(Utils.getStagePadding()).toEqual({ paddingLeft: 0, paddingRight: 0 })
  })

  it('should return expected value', () => {
    expect(Utils.getStagePadding({ stagePadding })).toEqual(stagePadding)
  })

  it('should return expected paddingLeft value', () => {
    const { paddingLeft } = Utils.getStagePadding({ stagePadding })
    expect(paddingLeft).toEqual(10)
  })

  it('should return expected paddingRight value', () => {
    const { paddingRight } = Utils.getStagePadding({ stagePadding })
    expect(paddingRight).toEqual(20)
  })
})
