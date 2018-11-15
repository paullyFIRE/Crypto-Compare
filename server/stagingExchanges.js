const getAltcoinStats = require('./service/altScrape')
const { x } = require('./service/api')

module.exports = [
  {
    exchangeName: 'AltcoinTrader',
    apiData: [
      {
        baseURL: 'http://www.altcointrader.co.za/',
        parser: body =>
          x(body, {
            askOrders: x('.orderUdBuy', [
              {
                price: '.orderUdBPr',
                volume: '.orderUdBAm'
              }
            ])
          }),
        selector: resp => resp.askOrders,
        dataLabel: 'orders'
      },
      {
        baseURL: 'http://www.altcointrader.co.za/',
        parser: body =>
          x(body, {
            askOrders: x('.orderUdBuy', [
              {
                price: '.orderUdBPr',
                volume: '.orderUdBAm'
              }
            ])
          }),
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
