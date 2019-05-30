import * as Utils from '../../../../src/lib/utils'

describe('math: setStartIndex, return start index, number', () => {
  it('should return default data', () => {
    const data = Utils.setStartIndex()
    expect(data).toEqual(0)
  })

  it('should return expected data if childrenLength more than index', () => {
    const data = Utils.setStartIndex(5, 2)
    expect(data).toEqual(2)
  })

  it('should return expected data if childrenLength less than index', () => {
    const data = Utils.setStartIndex(2, 3)
    expect(data).toEqual(1)
  })

  it('should return expected data if no childrenLength or no index', () => {
    const data = Utils.setStartIndex(1)
    expect(data).toEqual(0)
  })
})
