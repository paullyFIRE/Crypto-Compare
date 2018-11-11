const buyExchanges = require('./buyExchanges')
const sellExchanges = require('./sellExchanges')

const currencies = [
  {
    name: 'USD',
    baseURL: 'http://free.currencyconverterapi.com/api/v5/convert?q=USD_ZAR&compact=y',
    rateSelector: resp => resp.data.USD_ZAR.val
  }
]

const volumes = [0.05, 0.25, 0.5, 1, 2, 3]

module.exports = {
  exchanges: [...buyExchanges, ...sellExchanges],
  currencies,
  volumes
}
