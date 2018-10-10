export function debug (args) {
  if (window.__DEBUG__) {
    console.debug(args)
  }
}
