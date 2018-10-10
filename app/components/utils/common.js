const setTotalItemsInSlide = (responsiveConfig, childrenLength) => {
  let items = 1
  if (responsiveConfig) {
    const configKeys = Object.keys(responsiveConfig)

    if (configKeys.length) {
      configKeys.forEach(width => {
        if (width < window.innerWidth) {
          items = Math.min(responsiveConfig[width].items, childrenLength) || items
        }
      })
    }
  }
  return items
}

const getDotsLength = (slidesLength, items) => {
  if (Number(items) !== 0) {
    return slidesLength % items === 0
      ? Math.floor(slidesLength / items) - 1
      : Math.floor(slidesLength / items)
  }
  return 0
}

const getDotsCeilLength = (slidesLength, items) => {
  return (Number(items) !== 0) ? Math.ceil(slidesLength / items) : 0
}

const getActiveSlideIndex = (inactiveNext, index, items, slidesLength) => {
  const dotsLength = getDotsLength(slidesLength, items)
  const currentIndex = index + items

  if (items === 1) {
    if (currentIndex < items) {
      return slidesLength - items
    }
    else if (currentIndex > slidesLength) {
      return 0
    }
    else {
      return currentIndex - 1
    }
  } else {
    if (currentIndex === slidesLength + items) {
      return 0
    }
    else if (inactiveNext || currentIndex < items && currentIndex !== 0) {
      return dotsLength
    }
    else if (currentIndex === 0) {
      return slidesLength % items === 0 ? dotsLength : dotsLength - 1
    }
    else {
      return Math.floor(currentIndex / items) - 1
    }
  }
}

export { setTotalItemsInSlide, getActiveSlideIndex, getDotsCeilLength }
