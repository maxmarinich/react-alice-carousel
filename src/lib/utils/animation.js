import * as Utils from './index'
import { withDirection } from './index'

export function animate(element, options) {
  const { position = 0, duration = 0, transitionTimingFunction = 'step-start' } = options || {}

  if (Utils.isElement(element)) {
    element.style['transition'] = `transform ${duration}ms ${transitionTimingFunction}`
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
  const { itemWidth, items, infinite, stagePadding = {}, isRTL } = state

  if (infinite) {
    const { paddingLeft, paddingRight } = stagePadding
    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
  }

  return (items + currentIndex) * withDirection(-itemWidth, isRTL) || 0
}

export const isAnimatedItem = (i = 0, animationProps = {}) => {
  const { allowFadeOutAnimation, fadeOutIndex } = animationProps
  return !!allowFadeOutAnimation && fadeOutIndex === i
}
