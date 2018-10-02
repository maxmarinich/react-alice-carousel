export function animate(element, position, durationMs = 0) {
  const prefixes = ['webkit', 'moz', 'ms', 'o', '']

  if (element) {
    for (let value of prefixes) {
      element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`
      element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`
    }
  }
}

export function getTransformMatrix(element) {
  const { transform = '' } = element && getComputedStyle && getComputedStyle(element)
  const matched = transform.match(/[0-9., -]+/) || []
  if (typeof matched[0] === 'string') {
    return matched[0].split(',')
  }
  return []
}

export function getTranslateX(element) {
  const matrix = getTransformMatrix(element)
  return matrix[4]
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

export const deviceInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export const shouldCallHandlerOnWindowResize = (prevDimensions) => {
  const { width, height } = deviceInfo()
  return (prevDimensions.width !== width) || (prevDimensions.height !== height)
}

export const getStagePadding = (padding = {}) => {
  const { stagePadding } = padding
  const { paddingLeft = 0, paddingRight = 0 } = stagePadding

  return { paddingLeft, paddingRight }
}
