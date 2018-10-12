import { isAnimatedItem } from './animation'

const isActiveItem = (i, state) => {
  let { currentIndex, items, stagePadding } = state
  if (stagePadding.paddingLeft || stagePadding.paddingRight) {
    currentIndex += 1
  }
  return currentIndex + items === i
}

const isClonedItem = (i, state) => {
  const { items, slides, infinite } = state
  return infinite === false && (i < items || i > slides.length + items - 1)
}

const itemClassName = (i, state, animationProps) => {
  const isActive = isActiveItem(i, state) ? ' __active' : ''
  const isCloned = isClonedItem(i, state) ? ' __cloned' : ''
  const isAnimated = isAnimatedItem(i, animationProps) ? ' animated animated-out fadeOut' : ''

  return 'alice-carousel__stage-item' + isActive + isCloned + isAnimated
}

export { itemClassName }
