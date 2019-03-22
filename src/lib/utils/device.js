export function deviceInfo() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function shouldCallHandlerOnWindowResize(prevDimensions = {}) {
  const { width, height } = deviceInfo()
  return prevDimensions.width !== width || prevDimensions.height !== height
}
