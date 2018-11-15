const getAltcoinStats = require('./service/altScrape')

module.exports = [
  {
    exchangeName: 'AltcoinTrader',
    apiData: [
      {
        baseURL: getAltcoinStats,
        selector: resp => resp.askOrders,
        dataLabel: 'orders'
      },
      {
        baseURL: getAltcoinStats,
        selector: resp => resp.askOrders[0].price,
        dataLabel: 'price'
      }
    ],
    fees: 0.8,
    link: 'https://www.altcointrader.co.za/',
    currency: 'ZAR',
    type: 'sell'
  }
]
