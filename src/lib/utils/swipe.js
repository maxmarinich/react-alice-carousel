export const isVerticalTouchMoveDetected = (e, deltaX, deltaY, gap = 32) => {
  const vertical = Math.abs(deltaY)
  const horizontal = Math.abs(deltaX)
  return vertical > horizontal && horizontal < gap
}

export const calculateSwipeIndex = (itemWidth, position, direction, isRTL) => {
  const index = getSwipeIndex(position, itemWidth)
  const offset = getSwipeOffset(direction, isRTL)
  return index + offset
}

export const getSwipeDirection = (deltaX) => {
  return deltaX > 0 ? 'LEFT' : 'RIGHT'
}

export const getSwipeOffset = (direction, isRTL) => {
  return direction === (isRTL ? 'RIGHT' : 'LEFT') ? 1 : 0
}

export const getSwipeIndex = (position, itemWidth) => {
  const swipePosition = Math.abs(position)
  return Math.floor(swipePosition / itemWidth)
}

export const getSwipeIndexOnBeforeTouchEnd = (swipeIndex, items) => {
  return swipeIndex - items || 0
}

export const getSwipePositionOnBeforeTouchEnd = (swipeIndex, itemWidth, isRTL) => {
  return swipeIndex * (isRTL ? itemWidth : -itemWidth) || 0
}
