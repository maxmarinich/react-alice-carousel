export const cloneCarouselItems = (children = [], itemsInSlide, props) => {
  let items = itemsInSlide || 1
  const { stagePadding, infinite } = props || {}
  const { paddingLeft, paddingRight } = stagePadding || {}

  if (items > children.length) {
    items = children.length
  }

  if (infinite) {
    if (paddingLeft || paddingRight) {
      if (itemsInSlide < children.length) {
        items = itemsInSlide + 1
      } else {
        const lastElement = children.slice(-1)
        const firstElement = children.slice(0, 1)
        const clonesBefore = lastElement.concat(children)
        const clonesAfter = children.concat(firstElement)

        return [].concat(clonesBefore, children, clonesAfter)
      }
    }
  }

  const clonesAfter = children.slice(0, items)
  const clonesBefore = children.slice(children.length - items)

  return [].concat(clonesBefore, children, clonesAfter)
}

export const getElementWidth = (element) => {
  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect().width
  }
}

export const getSlides = (props) => {
  const { children, items = [] } = props || {}
  return children && children.length ? children : items
}

export const itemInfo = (props) => {
  const { items, currentIndex, infinite, slides = [] } = props || {}
  const isPrevSlideDisabled = infinite === false && currentIndex === 0
  const isNextSlideDisabled = infinite === false && slides.length - items === currentIndex

  return { isPrevSlideDisabled, isNextSlideDisabled }
}

export const getStagePadding = (props) => {
  const { stagePadding = {} } = props || {}
  const paddingLeft = Math.abs(stagePadding.paddingLeft) || 0
  const paddingRight = Math.abs(stagePadding.paddingRight) || 0

  return { paddingLeft, paddingRight }
}

export const getItemWidth = (galleryWidth = 0, totalItems) => {
  const width = Number(galleryWidth)
  const items = Number(totalItems)
  return width && items > 0 ? width / items : 0
}

export const getNextItem = (stageComponent, itemIndex) => {
  const children = (stageComponent && stageComponent.children) || []
  return (children[itemIndex] && children[itemIndex].firstChild) || null
}

export const getGalleryItemHeight = (stageComponent, itemIndex) => {
  const element = getNextItem(stageComponent, itemIndex)

  if (isElement(element)) {
    const styles = getComputedStyle(element)
    const marginTop = parseFloat(styles['marginTop'])
    const marginBottom = parseFloat(styles['marginBottom'])

    return Math.ceil(element.offsetHeight + marginTop + marginBottom)
  }
}

export const getSlideInfo = (currentIndex = 0, slidesLength = 0) => {
  let slideIndex = currentIndex + 1

  if (slideIndex < 1) {
    slideIndex = slidesLength
  } else if (slideIndex > slidesLength) {
    slideIndex = 1
  }

  return { slideIndex, slidesLength }
}

export const isElement = (element) => {
  return element instanceof Element || element instanceof HTMLDocument
}

export const getNextItemIndexBeforeTouchEnd = (currentTranslateXPosition, props = {}) => {
  const { infinite, items = 1, itemWidth = 0, slides = [], stagePadding = {} } = props
  const { paddingLeft, paddingRight } = stagePadding

  if (itemWidth <= 0 || items > slides.length) {
    return 0
  }

  let currentIndex = getCurrentIndex(currentTranslateXPosition, itemWidth, items)

  if (infinite && (paddingLeft || paddingRight)) {
    currentIndex -= 1
  }

  if (currentIndex === slides.length) {
    return 0
  }

  if (currentIndex < 0) {
    return slides.length + currentIndex
  }

  return currentIndex
}

export const getCurrentIndex = (currentTranslateXPosition, itemWidth, items) => {
  const value = Math.abs(currentTranslateXPosition / itemWidth)
  return Math.ceil(value) - items
}
