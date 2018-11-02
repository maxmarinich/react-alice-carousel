export function debug() {
  if (window.__DEBUG__) {
    console.debug(...arguments) //eslint-disable-line
  }
}
