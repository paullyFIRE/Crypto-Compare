const buyExchanges = require('./buyExchanges')
const sellExchanges = require('./sellExchanges')
const experimentalExchanges = require('./stagingExchanges')

const currencies = [
  {
    name: 'USD',
    baseURL: 'https://www.freeforexapi.com/api/live?pairs=USDZAR',
    rateSelector: resp => resp.data.rates.USDZAR.rate
  }
]

const volumes = [0.05, 0.25, 0.5, 1, 2, 3]

const port = process.env.PORT || 5000
const stagingExch = port === 5000 ? experimentalExchanges : []

module.exports = {
  exchanges: [...buyExchanges, ...sellExchanges],
  currencies,
  volumes
}
