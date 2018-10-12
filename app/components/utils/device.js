function deviceInfo() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function shouldCallHandlerOnWindowResize(prevDimensions) {
  const { width, height } = deviceInfo()
  return prevDimensions.width !== width || prevDimensions.height !== height
}

export { deviceInfo, shouldCallHandlerOnWindowResize }
