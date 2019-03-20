export const isVerticalTouchMoveDetected = (e, deltaX, deltaY, gap = 32) => {
  const vertical = Math.abs(deltaY)
  const horizontal = Math.abs(deltaX)
  return vertical > horizontal && horizontal < gap
}

export const getSwipeDirection = (deltaX) => {
  return deltaX > 0 ? 'LEFT' : 'RIGHT'
}
