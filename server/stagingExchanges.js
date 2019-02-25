const { x } = require('./services/api')

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
        baseURL: 'https://www.altcointrader.co.za/eth',
        parser: body =>
          x(body, {
            askOrders: x('.orderUdSell', [
              {
                price: '.orderUdSPr',
                volume: '.orderUdSAm'
              }
            ])
          }),
        selector: resp => resp.askOrders,
        dataLabel: 'ethOrders'
      }
    ],
    postApiData: [
      {
        selector: exch => (exch.orders[0] && exch.orders[0].price) || 0,
        dataLabel: 'price'
      },
      {
        selector: exch => (exch.ethOrders[0] && exch.ethOrders[0].price) || 0,
        dataLabel: 'ethPrice'
      }
    ],
    fees: 0.8,
    link: 'https://www.altcointrader.co.za/',
    currency: 'ZAR',
    type: 'sell'
  }
]
