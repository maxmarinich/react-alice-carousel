export function setTransformAnimation(element, position, durationMs = 0) {
  const prefixes = ['Webkit', 'Moz', 'ms', 'O', '']

  if (element) {
    for (let value of prefixes) {
      element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`
      element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`
    }
  }
}

export function debounce(func, ms = 0) {
  let timer = null

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
      timer = null
    }, ms)
  }
}

export function getElementWidth(element) {
  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect().width
  }
}

export function getItemWidth(galleryWidth, tottalItems) {
  return galleryWidth / tottalItems
}

export const deviceSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export const isDeviceResized = (prevDimensions) => {
  const currentDimensions = deviceSize()
  return (prevDimensions.width !== currentDimensions.width) || ( prevDimensions.height !== currentDimensions.height )
}
