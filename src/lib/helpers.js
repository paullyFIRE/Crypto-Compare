export const runFirstInterval = (fn, interval) => {
  fn()
  return setInterval(fn, interval)
}

export const formatRowDataWithConfigSelectors = (rowData, config) =>
  Object.entries(rowData).map(row => config.map(({ valueSelector }) => valueSelector(row)))

export const getHeadingsFromConfig = config =>
  config.reduce((acc, column) => (acc = [...acc, column.heading]), [])
