function debounce(func, ms = 0) {
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

export { debounce }
