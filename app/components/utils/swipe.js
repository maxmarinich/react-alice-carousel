const isVerticalTouchMoveDetected = (e, deltaX, deltaY) => {
  const gap = 32
  const vertical = Math.abs(deltaY)
  const horizontal = Math.abs(deltaX)
  return (vertical > horizontal && horizontal < gap)
}

const getSwipeDirection = (deltaX) => {
  return  deltaX > 0 ? 'LEFT' : 'RIGHT'
}

const getMaxSWipePosition = (state) => {
  const { items, itemWidth, slides = []} = state
  return (slides.length + items) * itemWidth
}

const getSwipeMinLimit = (itemWidth, { paddingLeft = 0}) => {
  return (paddingLeft) ? (itemWidth + paddingLeft) : 0
}

const getSwipeMaxLimit = (itemWidth, maxPosition, { paddingRight = 0}) => {
  return (paddingRight) ? (maxPosition + itemWidth - paddingRight) : maxPosition
}

const getSlideOffset = (itemWidth) => {
  return Math.min(itemWidth / 2, 250)
}

const getLeftTranslateLimit = (items, itemWidth) => {
  const slideOffset = getSlideOffset(itemWidth)
  return (items * -itemWidth) + slideOffset
}

const getRightTranslateLimit = (slidesLength, itemWidth) => {
  const slideOffset = getSlideOffset(itemWidth)
  return (slidesLength * -itemWidth) - slideOffset
}

export {
  isVerticalTouchMoveDetected,
  getSwipeDirection,
  getMaxSWipePosition,
  getSwipeMinLimit,
  getSwipeMaxLimit,
  getLeftTranslateLimit,
  getRightTranslateLimit
}
