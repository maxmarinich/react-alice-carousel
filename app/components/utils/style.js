import { isAnimatedItem } from './animation'

const intermediateTransitionProps = (condition, duration) => {
  return condition
    ? { fadeoutAnimationProcessing: true, style: { transition: 'transform 0ms ease-out' } }
    : { style: { transition: `transform ${duration}ms ease-out` } }
}

const itemStyles = (i, state, animationProps) => {
  const { fadeOutOffset } = animationProps
  const { itemWidth, duration } = state

  return isAnimatedItem(i, animationProps)
    ? { transform: `translateX(${fadeOutOffset}px)`, animationDuration: `${duration}ms`, width: `${itemWidth}px` }
    : { width: `${itemWidth}px` }
}

const stageStyle = (style, translate3d) => {
  return { ...style, transform: `translate3d(${translate3d}px, 0, 0)` }
}
const wrapperStyle = ({ paddingLeft, paddingRight }) => {
  return { paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px` }
}

export {
  itemStyles,
  stageStyle,
  wrapperStyle,
  intermediateTransitionProps
}
