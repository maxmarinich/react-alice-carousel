import * as Utils from './index'

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

export const calculateInitialProps = (props, rootComponent) => {
  const { startIndex, responsive, infinite } = props
  const style = Utils.getDefaultStyles()
  const slides = Utils.getSlides(props)
  const stagePadding = Utils.getStagePadding(props)
  const items = setTotalItemsInSlide(responsive, slides.length)
  const currentIndex = Utils.setStartIndex(slides.length, startIndex)
  const galleryWidth = Utils.getElementWidth(rootComponent)
  const itemWidth = Utils.getItemWidth(galleryWidth, items)
  const clones = Utils.cloneCarouselItems(slides, items, { stagePadding, infinite })
  const translate3d = Utils.getTranslate3dPosition(currentIndex, { itemWidth, items, stagePadding, infinite })

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
  }
}
