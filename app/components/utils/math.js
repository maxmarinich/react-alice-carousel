export const getDotsLength = (slidesLength, items) => {
  if (Number(items) !== 0) {
    return slidesLength % items === 0 ? Math.floor(slidesLength / items) - 1 : Math.floor(slidesLength / items)
  }
  return 0
}

export const getActiveSlideIndex = (inactiveNext, index, items, slidesLength) => {
  const dotsLength = getDotsLength(slidesLength, items)
  const currentIndex = index + items

  if (items === 1) {
    if (currentIndex < items) {
      return slidesLength - items
    } else if (currentIndex > slidesLength) {
      return 0
    } else {
      return currentIndex - 1
    }
  } else {
    if (currentIndex === slidesLength + items) {
      return 0
    } else if (inactiveNext || (currentIndex < items && currentIndex !== 0)) {
      return dotsLength
    } else if (currentIndex === 0) {
      return slidesLength % items === 0 ? dotsLength : dotsLength - 1
    } else {
      return Math.floor(currentIndex / items) - 1
    }
  }
}

export const setStartIndex = (childrenLength, index) => {
  const startIndex = index ? Math.abs(Math.ceil(index)) : 0
  return Math.min(startIndex, childrenLength - 1)
}

export const getFadeOutOffset = (itemIndex, currentIndex, itemWidth) => {
  if (itemIndex < currentIndex) {
    return (currentIndex - itemIndex) * -itemWidth
  } else {
    return (itemIndex - currentIndex) * itemWidth
  }
}

export const getMaxSWipePosition = (items, itemWidth, slidesLength) => {
  return (slidesLength + items) * itemWidth
}

export const getSwipeMinLimit = (itemWidth, { paddingLeft = 0 }) => {
  return paddingLeft ? itemWidth + paddingLeft : 0
}

export const getSwipeMaxLimit = (itemWidth, maxPosition, { paddingRight = 0 }) => {
  return paddingRight ? maxPosition + itemWidth - paddingRight : maxPosition
}

export const getSlideOffset = (itemWidth, offset = 250) => {
  return Math.min(itemWidth / 2, offset)
}

export const getLeftTranslateLimit = (items, itemWidth) => {
  return items * -itemWidth + getSlideOffset(itemWidth)
}

export const getRightTranslateLimit = (slidesLength, itemWidth) => {
  return slidesLength * -itemWidth - getSlideOffset(itemWidth)
}

export const getDotsCeilLength = (slidesLength, items) => {
  return Number(items) !== 0 ? Math.ceil(slidesLength / items) : 0
}

export const recalculateCurrentSlideIndex = ({ slides, currentIndex }) => {
  return currentIndex < 0 ? slides.length - 1 : 0
}

export const recalculateTranslatePosition = (state) => {
  const { items, itemWidth, slides, stagePadding } = state
  const maxSlidePosition = slides.length - 1
  const currentIndex = state.currentIndex < 0 ? maxSlidePosition : 0
  const nextIndex = currentIndex === 0 ? items : maxSlidePosition + items

  if (stagePadding.paddingLeft || stagePadding.paddingRight) {
    return (nextIndex + 1) * -itemWidth
  }
  return nextIndex * -itemWidth
}
