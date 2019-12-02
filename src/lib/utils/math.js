import * as Utils from './index'

export const getDotsLength = (slidesLength, items) => {
  if (slidesLength && items) {
    const dots = Math.floor(slidesLength / items)
    return slidesLength % items === 0 ? dots - 1 : dots
  }
  return 0
}

export const getActiveSlideIndex = (isNextSlideDisabled, props = {}) => {
  const { currentIndex: index, items, slides = [] } = props
  const currentIndex = index + items
  const slidesLength = slides.length

  return items === 1
    ? getSlideIndexForNotMultipleItems(currentIndex, items, slidesLength)
    : getSlideIndexForMultipleItems(currentIndex, items, slidesLength, isNextSlideDisabled)
}

export const getSlideIndexForNotMultipleItems = (currentIndex, items, slidesLength) => {
  if (currentIndex < items) return slidesLength - items
  if (currentIndex > slidesLength) return 0
  return currentIndex - 1
}

export const getSlideIndexForMultipleItems = (currentIndex, items, slidesLength, isNextSlideDisabled) => {
  const dotsLength = getDotsLength(slidesLength, items)

  if (currentIndex === slidesLength + items) return 0
  if (isNextSlideDisabled || (currentIndex < items && currentIndex !== 0)) return dotsLength
  if (currentIndex === 0) {
    return slidesLength % items === 0 ? dotsLength : dotsLength - 1
  }

  return items > 0 ? Math.floor(currentIndex / items) - 1 : 0
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

export const recalculatePositionOnBeforeTouchEnd = (items, itemWidth) => {
  return -getMinSwipePosition(items, itemWidth)
}

export const recalculateCurrentIndexOnBeforeTouchEnd = (slidesLength, items) => {
  return slidesLength - items || 0
}

export const getMaxSwipePosition = (items, itemWidth, slidesLength) => {
  return (slidesLength + items) * itemWidth || 0
}

export const getMinSwipePosition = (items, itemWidth) => {
  return items * itemWidth || 0
}

export const getMinSwipeLimit = (minSwipePosition = 0, stagePadding = {}) => {
  const { paddingLeft = 0 } = stagePadding
  return paddingLeft ? minSwipePosition : 0
}

export const getMaxSwipeLimit = (maxSwipePosition = 0, stagePadding = {}, itemWidth = 0) => {
  const { paddingRight = 0 } = stagePadding
  return paddingRight ? maxSwipePosition + itemWidth : maxSwipePosition
}

export const getSlideOffset = (itemWidth, offset = 250) => {
  return Math.min(itemWidth / 2, offset) || 0
}

export const getMinSwipeLimitIfNotInfinite = (items, itemWidth) => {
  return items * itemWidth - getSlideOffset(itemWidth) || 0
}

export const shouldRecalculateSwipePosition = (currentPosition, minPosition, maxPosition) => {
  return currentPosition >= 0 - minPosition || Math.abs(currentPosition) >= maxPosition
}

export const getMaxSwipeLimitIfNotInfinite = (slidesLength, itemWidth) => {
  return slidesLength * itemWidth + getSlideOffset(itemWidth) || 0
}

export const getDotsNavigationLength = (slidesLength, items) => {
  if (Number(items) !== 0) {
    return Math.ceil(slidesLength / items) || 0
  }
  return 0
}

export const getItemIndexForDotNavigation = (index, isTheLastIndex, slidesLength, itemsLength) => {
  const result = isTheLastIndex ? slidesLength - itemsLength : index * itemsLength
  return result || 0
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

export const calculateSlidesOffset = (props, state) => {
  const { items, infinite } = state
  const offset = infinite && Utils.isStagePadding(props) ? 1 : 0
  return items + offset
}

export const getIndexForItemHeightCalculation = (currentIndex, slidesOffset) => {
  return currentIndex + slidesOffset
}
