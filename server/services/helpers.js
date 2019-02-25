const compileApiCalls = (configExchanges, apiGET, apiScrape) =>
  configExchanges.reduce((acc, exchange) => {
    if (!exchange.apiData) return acc

    const { exchangeName } = exchange

    return [
      ...acc,
      ...exchange.apiData.map(apiCall => {
        const { baseURL, parser, selector, normalizer } = apiCall

        if (parser) {
          return apiScrape(baseURL, parser)
            .then(selector)
            .then(data => {
              return {
                [apiCall.dataLabel]: data,
                exchangeName
              }
            })
        }

        return apiGET(baseURL, selector, normalizer).then(data => ({
          [apiCall.dataLabel]: data,
          exchangeName
        }))
      })
    ]
  }, [])

const groupByVolume = (margins, volume) => margins.filter(margin => margin.volume === volume)

const groupByExchange = (margins, exchange) =>
  margins.filter(margin => margin.buy.name === exchange || margin.sell.name === exchange)

const startWithInterval = (fn, duration) => {
  fn()
  return setInterval(() => fn(), duration)
}

const math = require('mathjs')
const getVolumeOrders = (data, volumeTheshhold) => {
  const orders = []

  const { volume } = data.reduce(
    (acc, item) => {
      if (!acc.done) {
        const itemVolume = parseFloat(item.volume)

        orders.push({
          ...item,
          volume: math.format(volumeTheshhold - acc.volume, {
            precision: 8
          })
        })

        acc.volume = volumeTheshhold
        acc.done = true
      }

      return acc
    },
    { volume: 0, done: false }
  )

  return { orders, availableVolume: volume }
}

const calculateWeightedMean = (data, availableVolume) =>
  data.reduce((acc, item) => {
    const price = parseFloat(item.price)
    const weight = item.volume / availableVolume

    return (acc += price * weight)
  }, 0)

module.exports = {
  compileApiCalls,
  groupByVolume,
  groupByExchange,
  startWithInterval,
  getVolumeOrders,
  calculateWeightedMean
}
