const compileApiCalls = (configExchanges, apiGET, apiScape) =>
  configExchanges.reduce((acc, exchange) => {
    if (!exchange.apiData) return acc

    const { exchangeName } = exchange

    return [
      ...acc,
      ...exchange.apiData.map(apiCall => {
        const { baseURL, parser, selector, normalizer } = apiCall

        if (parser) {
          return apiScape(baseURL, parser)
            .then(selector)
            .then(data => ({
              [apiCall.dataLabel]: data,
              exchangeName
            }))
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

module.exports = {
  compileApiCalls,
  groupByVolume,
  groupByExchange,
  startWithInterval
}
