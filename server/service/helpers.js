const compileApiCalls = (configExchanges, apiGET) =>
  configExchanges.reduce((acc, exchange) => {
    if (!exchange.apiData) return acc

    const { exchangeName } = exchange

    return [
      ...acc,
      ...exchange.apiData.map(apiCall => {
        const { baseURL, selector, normalizer } = apiCall

        return apiGET(baseURL, selector, normalizer).then(data => ({
          [apiCall.dataLabel]: data,
          exchangeName
        }))
      })
    ]
  }, [])

const startWithInterval = (fn, duration) => {
  fn()
  return setInterval(() => fn(), duration)
}

module.exports = {
  compileApiCalls,
  startWithInterval
}
