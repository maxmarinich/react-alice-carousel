import * as Utils from './index'

export const getIntermediateTransitionProps = (condition, duration, transitionTimingFunction = '') => {
  return condition
    ? { fadeoutAnimationProcessing: true, style: { transition: 'transform 0ms' } }
    : { style: { transition: `transform ${duration}ms ${transitionTimingFunction}` } }
}

export const itemStyles = (i, state, animationProps) => {
  const { fadeOutOffset = 0 } = animationProps || {}
  const { itemWidth = 0, duration = 0 } = state || {}

  return Utils.isAnimatedItem(i, animationProps)
    ? { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
    : { width: `${itemWidth}px` }
}

export const getDefaultStyles = (options) => {
  const { duration = 0, transitionTimingFunction = '' } = options || {}
  return { transition: `transform ${duration}ms ${transitionTimingFunction}` }
}

export const getStageStyles = (nextStyles = {}, currentStyles = {}) => {
  const { translate3d = 0, height } = nextStyles
  const transform = `translate3d(${translate3d}px, 0, 0)`

  return { ...currentStyles, transform, height }
}

export const getWrapperStyles = (element, props = {}, state = {}) => {
  const { paddingLeft, paddingRight } = Utils.getStagePadding(props)
  const height = props.autoHeight && Utils.getGalleryItemHeight(element, props, state)
  const transition = height && `height ${state.duration}ms`

  return {
    height,
    transition,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
  }
}
