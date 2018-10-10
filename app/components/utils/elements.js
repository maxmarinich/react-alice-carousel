const cloneCarouselItems = (children, itemsInSlide, props) => {
  let items = itemsInSlide
  const { stagePadding, infinite } = props
  const { paddingLeft, paddingRight } = getStagePadding({ stagePadding })

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

const getElementWidth = (element) => {
  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect().width
  }
}

const getSlides = ({ children, items = []}) => {
  return children && children.length ? children : items
}

const getStagePadding = (props) => {
  const { stagePadding } = props || {}
  const { paddingLeft = 0, paddingRight = 0 } = stagePadding

  return { paddingLeft, paddingRight }
}

const getItemWidth = (galleryWidth = 0, totalItems) => {
  const width = Number(galleryWidth)
  const items = Number(totalItems)
  return (width && items > 0) ? (width / items) : 0
}

const getSlideInfo = (index, slidesLength) => {
  let slideIndex = index + 1

  if (slideIndex < 1) { slideIndex = slidesLength }
  else if (slideIndex > slidesLength) { slideIndex = 1 }

  return {
    slideIndex,
    slidesLength,
  }
}

export { getElementWidth, getSlides, getStagePadding, getItemWidth, getSlideInfo, cloneCarouselItems }
