import * as Utils from './index'

export const preserveProps = (props, values) => {
  const { preservePosition } = props || {}
  return preservePosition ? { ...props, ...values } : props
}

export const withDirection = (value, isRTL) => {
  return value * (isRTL ? -1 : 1)
}

export const setTotalItemsInSlide = (responsiveConfig, childrenLength) => {
  let items = 1
  if (responsiveConfig) {
    const configKeys = Object.keys(responsiveConfig)

    if (configKeys.length) {
      configKeys.forEach((width) => {
        if (width < window.innerWidth) {
          items = Math.min(responsiveConfig[width].items, childrenLength) || items
        }
      })
    }
  }
  return items
}

export const calculateInitialProps = (props, el) => {
  const { startIndex, responsive, infinite, autoPlay, isRTL } = props
  const style = Utils.getDefaultStyles()
  const slides = Utils.getSlides(props)
  const stagePadding = Utils.getStagePadding(props)
  const items = setTotalItemsInSlide(responsive, slides.length)
  const currentIndex = Utils.setStartIndex(slides.length, startIndex)
  const { width: galleryWidth } = Utils.getElementDimensions(el)
  const itemWidth = Utils.getItemWidth(galleryWidth, items)
  const clones = Utils.cloneCarouselItems(slides, items, { stagePadding, infinite })
  const translate3d = Utils.getTranslate3dPosition(currentIndex, {
    itemWidth,
    items,
    stagePadding,
    infinite,
    isRTL,
  })

  return {
    items,
    itemWidth,
    currentIndex,
    slides,
    clones,
    infinite,
    translate3d,
    stagePadding,
    style,
    isAutoPlaying: autoPlay,
    isRTL,
  }
}
