import * as Utils from '../../../../src/lib/utils'

describe('classnames: containerClassName: should return className, string', () => {
  const className = 'alice-carousel'
  const rtlClassName = 'alice-carousel__rtl'

  it('should return default value', () => {
    const data = Utils.containerClassName()
    expect(data).toEqual(className)
  })

  it('should includes active class', () => {
    const data = Utils.containerClassName({ isRTL: true })
    expect(data).toEqual(`${className} ${rtlClassName}`)
  })
})
