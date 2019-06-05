import * as Utils from './index'

export const getIntermediateTransitionProps = (condition, duration) => {
  return condition
    ? { fadeoutAnimationProcessing: true, style: { transition: 'transform 0ms ease-out' } }
    : { style: { transition: `transform ${duration}ms ease-out` } }
}

export const itemStyles = (i, state, animationProps) => {
  const { fadeOutOffset } = animationProps
  const { itemWidth, duration } = state

  return Utils.isAnimatedItem(i, animationProps)
    ? { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
    : { width: `${itemWidth}px` }
}

export const getDefaultStyles = (duration = 0) => {
  return { transition: `transform ${duration}ms ease-out` }
}

export const getStageStyles = (nextStyles = {}, currentStyles = {}) => {
  const { translate3d = 0, height } = nextStyles
  const transform = `translate3d(${translate3d}px, 0, 0)`

  return { ...currentStyles, transform, height }
}

export const getWrapperStyles = (element, props = {}, state = {}) => {
  const { paddingLeft, paddingRight } = Utils.getStagePadding(props)
  const height = props.autoHeight && Utils.getGalleryItemHeight(element, props, state)
  const transition = height && `height ${state.duration}ms ease-out`

  return {
    height,
    transition,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
  }
}
