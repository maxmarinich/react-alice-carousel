// A solution for React 16 complaining of missing rAF.

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}
