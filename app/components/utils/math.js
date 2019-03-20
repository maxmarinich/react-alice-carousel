export const getDotsLength = (slidesLength, items) => {
  if (items && slidesLength) {
    return slidesLength % items === 0 ? Math.floor(slidesLength / items) - 1 : Math.floor(slidesLength / items)
  }
  return 0
}

export const getActiveSlideIndex = (isNextSlideDisabled, props = {}) => {
  const { currentIndex: index, items, slides = [] } = props
  const currentIndex = index + items
  const slidesLength = slides.length

  if (items === 1) {
    if (currentIndex < items) {
      return slidesLength - items
    } else if (currentIndex > slidesLength) {
      return 0
    } else {
      return currentIndex - 1
    }
  } else {
    const dotsLength = getDotsLength(slidesLength, items)

    if (currentIndex === slidesLength + items) {
      return 0
    } else if (isNextSlideDisabled || (currentIndex < items && currentIndex !== 0)) {
      return dotsLength
    } else if (currentIndex === 0) {
      return slidesLength % items === 0 ? dotsLength : dotsLength - 1
    } else {
      return items > 0 ? Math.floor(currentIndex / items) - 1 : 0
    }
  }
}

export const setStartIndex = (childrenLength, index) => {
  const startIndex = index ? Math.abs(Math.ceil(index)) : 0
  return Math.min(startIndex, childrenLength - 1) || 0
}

export const getFadeOutOffsetOnDotClick = (itemIndex, currentIndex, itemWidth) => {
  if (itemIndex < currentIndex) {
    return (currentIndex - itemIndex) * -itemWidth || 0
  } else {
    return (itemIndex - currentIndex) * itemWidth || 0
  }
}

export const getFadeOutIndexOnClick = (currentIndex) => {
  return currentIndex === 0 ? 1 : currentIndex + 1
}

export const getFadeOutOffsetOnClick = (direction, itemWidth) => {
  return direction === 'next' ? itemWidth : -itemWidth
}

export const getMaxSwipePosition = (items, itemWidth, slidesLength) => {
  return (slidesLength + items) * itemWidth || 0
}

export const getMinSwipeLimit = (stagePadding = {}) => {
  const { paddingLeft = 0 } = stagePadding
  return paddingLeft ? paddingLeft : 0
}

export const getMaxSwipeLimit = (maxPosition, stagePadding = {}) => {
  const { paddingRight = 0 } = stagePadding
  const limit = paddingRight ? maxPosition + paddingRight : maxPosition
  return limit || 0
}

export const getSlideOffset = (itemWidth, offset = 250) => {
  return Math.min(itemWidth / 2, offset) || 0
}

export const geTranslateLimit = (items, itemWidth) => {
  return items * itemWidth - getSlideOffset(itemWidth) || 0
}

export const getDotsNavigationLength = (slidesLength, items) => {
  if (Number(items) !== 0) {
    return Math.ceil(slidesLength / items) || 0
  }
  return 0
}

export const getItemIndexForDotNavigation = (index, isTheLastIndex, slidesLength, itemsLength) => {
  if (isTheLastIndex) {
    return slidesLength - itemsLength
  }
  return index * itemsLength
}

export const isTheLastDotIndex = (index, infinite, dotsLength) => {
  return infinite === false && index === dotsLength - 1
}

export const recalculateCurrentSlideIndex = (state = {}) => {
  const { currentIndex, slides = [] } = state
  return currentIndex < 0 ? slides.length - 1 : 0
}

export const recalculateTranslatePosition = (state = {}) => {
  const { items, itemWidth, stagePadding = {}, slides = [] } = state
  const maxSlidePosition = slides.length - 1

  const currentIndex = state.currentIndex < 0 ? maxSlidePosition : 0
  const nextIndex = currentIndex === 0 ? items : maxSlidePosition + items

  if (stagePadding.paddingLeft || stagePadding.paddingRight) {
    return (nextIndex + 1) * -itemWidth || 0
  }
  return nextIndex * -itemWidth || 0
}
