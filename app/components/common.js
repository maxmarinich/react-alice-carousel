export function setTransformAnimation(element, position, durationMs = 0) {
  const prefixes = ['Webkit', 'Moz', 'ms', 'O', '']

  for (let value of prefixes) {
    element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`
    element.style[value + 'Transform'] = `translate3d(${position}px, 0, 0)`
  }
}

export function throttle(func, ms = 0) {
  let savedArgs,savedThis, isThrottled = false

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments
      savedThis = this
      return
    }

    func.apply(this, arguments)
    isThrottled = true

    setTimeout(() => {
      isThrottled = false

      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs)
        savedArgs = savedThis = null
      }
    }, ms)
  }
  return wrapper
}

export function primitiveEquals(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function childrenKeysHaveChanged(currentChildren, nextChildren) {
  return currentChildren.length === currentChildren.length && (
    currentChildren.every((item, index) => item.key === nextChildren[index].key)
  )
}
