import { isAnimatedItem } from './animation'

export const getIntermediateTransitionProps = (condition, duration) => {
  return condition
    ? { fadeoutAnimationProcessing: true, style: { transition: 'transform 0ms ease-out' } }
    : { style: { transition: `transform ${duration}ms ease-out` } }
}

export const itemStyles = (i, state, animationProps) => {
  const { fadeOutOffset } = animationProps
  const { itemWidth, duration } = state

  return isAnimatedItem(i, animationProps)
    ? { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
    : { width: `${itemWidth}px` }
}

export const getDefaultStyle = (duration = 0) => {
  return { transition: `transform ${duration}ms ease-out` }
}

export const stageStyle = (nextStyles = {}, currentStyles = {}) => {
  const { translate3d = 0, height } = nextStyles
  const transform = `translate3d(${translate3d}px, 0, 0)`

  return { ...currentStyles, transform, height }
}

export const wrapperStyle = (nextStyles = {}, currentStyles = {}) => {
  const { paddingLeft, paddingRight, height } = nextStyles
  const { duration, initialStageHeight  } = currentStyles
  const transition = undefined // initialStageHeight && `height ${duration}ms ease-out`
  return {
    ...currentStyles,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    height,
    transition,
  }
}
