import { getStagePadding } from './elements'

function animate(element, position, durationMs = 0) {
  const prefixes = ['webkit', 'moz', 'ms', 'o', '']

  if (element) {
    for (let value of prefixes) {
      element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`
      element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`
    }
  }
}

function getTranslateX(element) {
  const translateXIndex = 4
  const matrix = getTransformMatrix(element)
  return matrix[translateXIndex]
}

function getFadeOutOffset(itemIndex, currentIndex, itemWidth) {
  if (itemIndex < currentIndex) {
    return (currentIndex - itemIndex) * -itemWidth
  } else {
    return (itemIndex - currentIndex) * itemWidth
  }
}

function getTransformMatrix(element) {
  const { transform = '' } = element && getComputedStyle && getComputedStyle(element) || {}
  const matched = transform.match(/[0-9., -]+/) || []
  if (typeof matched[0] === 'string') {
    return matched[0].split(',')
  }
  return []
}

const getTranslate3dPosition = (currentIndex, state) => {
  const { itemWidth, items, infinite } = state

  if (infinite) {
    const { paddingLeft, paddingRight } = getStagePadding(state)
    if (paddingLeft || paddingRight) {
      currentIndex += 1
    }
  }

  return (items + currentIndex) * -itemWidth
}

export { animate, getTranslateX, getTranslate3dPosition, getFadeOutOffset }
