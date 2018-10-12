const isVerticalTouchMoveDetected = (e, deltaX, deltaY) => {
  const gap = 32
  const vertical = Math.abs(deltaY)
  const horizontal = Math.abs(deltaX)
  return vertical > horizontal && horizontal < gap
}

const getSwipeDirection = (deltaX) => {
  return deltaX > 0 ? 'LEFT' : 'RIGHT'
}

export { isVerticalTouchMoveDetected, getSwipeDirection }
