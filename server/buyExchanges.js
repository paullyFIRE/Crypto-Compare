module.exports = [
  {
    exchangeName: 'Kraken',
    apiData: [
      {
        baseURL: 'https://api.kraken.com/0/public/Depth?pair=XXBTZUSD&count=30',
        selector: resp => resp.data.result.XXBTZUSD.bids,
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://api.kraken.com/0/public/Depth?pair=XETHXXBT&count=30',
        selector: resp => resp.data.result.XETHXXBT.asks,
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'ethOrders'
      },
      {
        baseURL: 'https://api.kraken.com/0/public/AssetPairs?pair=XXBTZUSD&info=fees',
        selector: resp => resp.data.result.XXBTZUSD.fees[0][1],
        dataLabel: 'fees'
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
    link: 'https://trade.kraken.com/markets/kraken/btc/eur',
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
    link: 'https://www.bitstamp.net/market/tradeview/',
    fees: 0.25,
    currency: 'USD',
    type: 'buy'
  },
  {
    exchangeName: 'Binance',
    apiData: [
      {
        baseURL: 'https://api.binance.com/api/v1/depth?symbol=BTCUSDT',
        selector: resp => resp.data.bids.slice(0, 30),
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://api.binance.com/api/v1/depth?symbol=BTCUSDT',
        selector: resp => resp.data.bids[0][0],
        dataLabel: 'price'
      }
    ],
    link: 'https://api.binance.com/api/v1/depth?symbol=BTCUSDT',
    fees: 0.1,
    currency: 'USD',
    type: 'buy'
  },
  {
    exchangeName: 'Poloniex',
    apiData: [
      {
        baseURL:
          'https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=25',
        selector: resp => resp.data.bids,
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL:
          'https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=25',
        selector: resp => resp.data.bids[0][0],
        dataLabel: 'price'
      }
    ],
    link: 'https://api.binance.com/api/v1/depth?symbol=BTCUSDT',
    fees: 0.25,
    currency: 'USD',
    type: 'buy'
  },
  {
    exchangeName: 'Liquid',
    apiData: [
      {
        baseURL: 'https://api.liquid.com/products/1/price_levels',
        selector: resp => resp.data.sell_price_levels,
        normalizer: ([price, volume]) => ({ price, volume }),
        dataLabel: 'orders'
      },
      {
        baseURL: 'https://api.liquid.com/products/1/price_levels',
        selector: resp => resp.data.sell_price_levels[0][0],
        dataLabel: 'price'
      },
      {
        baseURL: 'https://api.liquid.com/products/1',
        selector: resp => resp.data.taker_fee,
        dataLabel: 'fees'
      }
    ],
    link: 'https://api.binance.com/api/v1/depth?symbol=BTCUSDT',
    currency: 'USD',
    type: 'buy'
  }
]
