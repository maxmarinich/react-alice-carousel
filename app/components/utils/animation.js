import { isElement } from './elements'

function animate(element, position = 0, durationMs = 0) {
  if (isElement(element)) {
    element.style['transition'] = `transform ${durationMs}ms ease-out`
    element.style['transform'] = `translate3d(${position}px, 0, 0)`
  }
  return element
}

function getTranslateX(element) {
  if (isElement(element)) {
    const translateXIndex = 4
    const matrix = getTransformMatrix(element)
    return matrix[translateXIndex]
  }
}

function getTransformMatrix(element) {
  if (isElement(element)) {
    const { transform = '' } = getComputedStyle(element) || {}
    const matched = transform.match(/[0-9., -]+/) || []
    if (typeof matched[0] === 'string') {
      return matched[0].split(',')
    }
  }
  return []
}

const getTranslate3dPosition = (currentIndex = 0, state = {}) => {
  const { itemWidth, items, infinite, stagePadding = {}} = state

  if (infinite) {
    const { paddingLeft, paddingRight } = stagePadding
    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
  }

  return (items + currentIndex) * -itemWidth
}

const isAnimatedItem = (i, animationProps = {}) => {
  const { allowFadeOutAnimation, fadeOutIndex } = animationProps
  return !!allowFadeOutAnimation && fadeOutIndex === i
}

export { animate, getTranslateX, getTranslate3dPosition, isAnimatedItem, getTransformMatrix }
