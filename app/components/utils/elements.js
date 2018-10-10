const getElementWidth = (element) => {
  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect().width
  }
}

const getSlides = ({ children, items = []}) => {
  return children && children.length ? children : items
}

const getStagePadding = (padding = {}) => {
  const { stagePadding } = padding
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

export { getElementWidth, getSlides, getStagePadding, getItemWidth, getSlideInfo }
