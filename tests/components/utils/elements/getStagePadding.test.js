import * as Utils from '../../../../app/components/utils'

describe('elements: getStagePadding, return plan object, {}', () => {
  const stagePadding = { paddingLeft: 10, paddingRight: 20 }

  it('should return default value', () => {
    expect(Utils.getStagePadding()).toEqual({ paddingLeft: 0, paddingRight: 0 })
  })

  it('should return expected value', () => {
    expect(Utils.getStagePadding({ stagePadding })).toEqual(stagePadding)
  })

  it('should return expected paddingLeft value', () => {
    expect(Utils.getStagePadding({ stagePadding })).toEqual(10)
  })

  it('should return expected paddingRight value', () => {
    expect(Utils.getStagePadding({ stagePadding })).toEqual(20)
  })
})
