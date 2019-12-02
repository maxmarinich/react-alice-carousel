import * as Utils from './index'

export function animate(element, position = 0, durationMs = 0) {
  if (Utils.isElement(element)) {
    element.style['transition'] = `transform ${durationMs}ms ease-out`
    element.style['transform'] = `translate3d(${position}px, 0, 0)`
  }
  return element
}

export function getTranslateX(element) {
  const matrix = getTransformMatrix(element)
  const tx = (matrix && matrix[4]) || ''
  return Number(tx)
}

export function getTransformMatrix(element) {
  if (Utils.isElement(element)) {
    const { transform } = getComputedStyle(element)
    const matched = transform.match(/(-?[0-9.]+)/g)

    return matched || []
  }
  return []
}

export const getTranslate3dPosition = (currentIndex = 0, state = {}) => {
  const { itemWidth, items, infinite, stagePadding = {} } = state

  if (infinite) {
    const { paddingLeft, paddingRight } = stagePadding
    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
  }
  return (items + currentIndex) * -itemWidth || 0
}

export const isAnimatedItem = (i = 0, animationProps = {}) => {
  const { allowFadeOutAnimation, fadeOutIndex } = animationProps
  return !!allowFadeOutAnimation && fadeOutIndex === i
}
