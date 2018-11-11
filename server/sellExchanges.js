module.exports = [
  {
    exchangeName: 'Luno',
    apiData: [
      {
        baseURL: 'https://api.mybitx.com/api/1/ticker?pair=XBTZAR',
        selector: resp => resp.data.last_trade,
        dataLabel: 'price'
      },
      {
        baseURL: 'https://api.mybitx.com/api/1/orderbook_top?pair=XBTZAR',
        selector: resp => resp.data.asks,
        dataLabel: 'orders'
      }
    ],
    link: 'https://www.luno.com/en/price',
    fees: 0.75,
    currency: 'ZAR',
    type: 'sell'
  },
  {
    exchangeName: 'Ice3x',
    apiData: [
      {
        baseURL: 'https://ice3x.com/api/v1/orderbook/info?pair_id=3',
        selector: resp => resp.data.response.entities.asks,
        normalizer: ({ price, amount }) => ({ price, volume: amount }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://ice3x.com/api/v1/orderbook/info?pair_id=3',
        selector: resp => resp.data.response.entities.asks[0].price,
        dataLabel: 'price'
      }
    ],
    fees: 1,
    link: 'https://ice3x.com/',
    currency: 'ZAR',
    type: 'sell'
  }
]
