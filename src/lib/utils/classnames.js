import { isAnimatedItem } from './animation'

export const isActiveItem = (i = 0, state = {}) => {
  let { currentIndex, items, stagePadding = {}} = state
  if (stagePadding.paddingLeft || stagePadding.paddingRight) {
    currentIndex += 1
  }
  return currentIndex + items === i
}

export const isClonedItem = (i = 0, state = {}) => {
  const { infinite, items, slides = [] } = state
  return infinite === false && (i < items || i > slides.length + items - 1)
}

export const itemClassName = (i = 0, state = {}, animationProps = {}) => {
  const isActive = isActiveItem(i, state) ? ' __active' : ''
  const isCloned = isClonedItem(i, state) ? ' __cloned' : ''
  const isAnimated = isAnimatedItem(i, animationProps) ? ' animated animated-out fadeOut' : ''

  return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated
}
