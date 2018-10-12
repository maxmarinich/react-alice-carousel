import { cloneCarouselItems, getElementWidth, getItemWidth, getSlides, getStagePadding } from './elements'
import { getTranslate3dPosition } from './animation'
import { setStartIndex } from './math'

const setTotalItemsInSlide = (responsiveConfig, childrenLength) => {
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
    stagePadding
  }
}

export { setTotalItemsInSlide, calculateInitialProps }
