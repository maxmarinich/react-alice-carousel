import { cloneCarouselItems, getElementWidth, getItemWidth, getSlides, getStagePadding } from './elements'
import { getTranslate3dPosition } from './animation'

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

const setStartIndex = (childrenLength, index) => {
  const startIndex = index ? Math.abs(Math.ceil(index)) : 0
  return Math.min(startIndex, (childrenLength - 1))
}

const calculateInitialProps = (props, rootComponent) => {
  const slides = getSlides(props)
  const stagePadding = getStagePadding(props)
  const { startIndex, responsive, infinite } = props
  const items = setTotalItemsInSlide(responsive, slides.length)
  const currentIndex = setStartIndex(slides.length, startIndex)
  const galleryWidth = getElementWidth(rootComponent)
  const itemWidth = getItemWidth(galleryWidth, items)
  const clones = cloneCarouselItems(slides, items, { stagePadding, infinite })
  const translate3d = getTranslate3dPosition(currentIndex, { itemWidth, items, stagePadding, infinite })

  return {
    items,
    itemWidth,
    currentIndex,
    slides,
    clones,
    infinite,
    translate3d,
    stagePadding,
  }
}

export {
  setTotalItemsInSlide,
  getActiveSlideIndex,
  getDotsCeilLength,
  setStartIndex,
  calculateInitialProps
}
