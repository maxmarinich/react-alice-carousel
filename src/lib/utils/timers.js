export function debounce(func, ms = 0) {
  let timer = null

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
      timer = null
    }, ms)
  }
}

export function throttle(func, ms) {
  let isThrottled, savedArgs, savedThis

  return function() {
    if (isThrottled) {
      savedArgs = arguments
      savedThis = this
      return
    }

    func.apply(this, arguments)
    isThrottled = true

    setTimeout(function() {
      isThrottled = false
      if (savedArgs) {
        func.apply(savedThis, savedArgs)
        savedArgs = savedThis = null
      }
    }, ms)
  }
}
