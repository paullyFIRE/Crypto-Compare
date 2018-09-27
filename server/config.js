const exchanges = [
  {
    exchangeName: 'Luno',
    baseURL: 'https://api.mybitx.com/api/1/ticker?pair=XBTZAR',
    priceSelector: resp => resp.data.last_trade,
    currency: 'ZAR'
  },
  {
    exchangeName: 'Kraken',
    baseURL: 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
    priceSelector: resp => resp.data.result.XXBTZUSD.c[0],
    currency: 'USD'
  }
]

const currencies = [
  {
    name: 'USD',
    baseURL: 'http://free.currencyconverterapi.com/api/v5/convert?q=USD_ZAR&compact=y',
    rateSelector: resp => resp.data.USD_ZAR.val
  }
]

module.exports.exchanges = exchanges
module.exports.currencies = currencies
