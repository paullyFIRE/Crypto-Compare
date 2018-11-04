const exchanges = [
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
    currency: 'ZAR',
    type: 'sell'
  },
  {
    exchangeName: 'Kraken',
    apiData: [
      {
        baseURL: 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
        selector: resp => resp.data.result.XXBTZUSD.c[0],
        dataLabel: 'price'
      },
      {
        baseURL: 'https://api.kraken.com/0/public/Depth?pair=XXBTZUSD&count=30',
        selector: resp => resp.data.result.XXBTZUSD.bids,
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://api.kraken.com/0/public/AssetPairs?pair=XXBTZUSD&info=fees',
        selector: resp => resp.data.result.XXBTZUSD.fees[0][1],
        dataLabel: 'fees'
      }
    ],
    currency: 'USD',
    type: 'buy'
  },
  {
    exchangeName: 'Bitstamp',
    apiData: [
      {
        baseURL: 'https://www.bitstamp.net/api/order_book?group=1',
        selector: resp => resp.data.bids.slice(0, 30),
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://www.bitstamp.net/api/order_book?group=1',
        selector: resp => resp.data.bids[0][0],
        dataLabel: 'price'
      }
    ],
    fees: 0.25,
    currency: 'USD',
    type: 'buy'
  }
]

const currencies = [
  {
    name: 'USD',
    baseURL: 'http://free.currencyconverterapi.com/api/v5/convert?q=USD_ZAR&compact=y',
    rateSelector: resp => resp.data.USD_ZAR.val
  }
]

const volumes = [0.25, 0.5, 1, 2, 3]

module.exports = {
  exchanges,
  currencies,
  volumes
}
