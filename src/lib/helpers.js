export const runFirstInterval = (fn, interval) => {
  fn()
  return setInterval(fn, interval)
}
