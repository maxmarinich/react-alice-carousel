export const isVerticalTouchMoveDetected = (e, deltaX, deltaY, gap = 20) => {
  return deltaY > deltaX && deltaX < gap
}

export const calculateSwipeIndex = (itemWidth, position, direction) => {
  const index = getSwipeIndex(position, itemWidth)
  const offset = getSwipeOffset(direction)
  return index + offset
}

export const getSwipeDirection = (prevDeltaX = 0, deltaX = 0) => {
  const vector = Math.round((prevDeltaX - deltaX) * 100)
  return vector < 0 ? 'LEFT' : 'RIGHT'
}

export const getSwipeOffset = (direction) => {
  return direction === 'LEFT' ? 1 : 0
}

export const getSwipeIndex = (position, itemWidth) => {
  const swipePosition = Math.abs(position)
  return Math.floor(swipePosition / itemWidth)
}

export const getSwipeIndexOnBeforeTouchEnd = (swipeIndex, items) => {
  return swipeIndex - items || 0
}

export const getSwipePositionOnBeforeTouchEnd = (swipeIndex, itemWidth) => {
  return swipeIndex * -itemWidth || 0
}
