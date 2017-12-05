export function setTransformAnimation(element, position, durationMs = 0) {
  const prefixes = ['Webkit', 'Moz', 'ms', 'O', ''];

  for (let value of prefixes) {
    element.style[value + 'Transition'] = `transform ${durationMs}ms ease-out`;
    element.style[value + 'Transform'] = position ? `translate3d(${position}px, 0, 0)` : null;
  }
}

export function throttle(func, ms = 0) {
  let savedArgs,savedThis, isThrottled = false;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;

      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}
