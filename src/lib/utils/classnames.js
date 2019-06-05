import * as Utils from './index'

export const isActiveItem = (i = 0, state = {}) => {
  let { currentIndex, items, infinite, stagePadding = {}} = state

  if (infinite && (stagePadding.paddingLeft || stagePadding.paddingRight)) {
    currentIndex += 1
  }

  const index = currentIndex + items
  return i >= index && i < index + items
}

export const isClonedItem = (i = 0, state = {}) => {
  const { infinite, items, slides = [] } = state
  return infinite === false && (i < items || i > slides.length + items - 1)
}

export const itemClassName = (i = 0, state = {}, animationProps = {}) => {
  const isActive = isActiveItem(i, state) ? ' __active' : ''
  const isCloned = isClonedItem(i, state) ? ' __cloned' : ''
  const isAnimated = Utils.isAnimatedItem(i, animationProps) ? ' animated animated-out fadeOut' : ''

  return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated
}
