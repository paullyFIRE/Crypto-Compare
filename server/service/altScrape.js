var x = require('x-ray')()
const makeDriver = require('request-x-ray')
const request = require('request')

const options = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
  }
}

const driver = makeDriver(options)

x.driver(driver)

const options2 = {
  url: 'http://www.altcointrader.co.za/',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
  }
}

const getAltcoinStats2 = request(options2, (err, resp, body) => {
  return x(body, {
    askOrders: x('.orderUdSell', [
      {
        price: '.orderUdSPr',
        volume: '.orderUdSAm'
      }
    ])
  })
})

const getAltcoinStatsSellOrders = () => {
  const url = 'http://www.altcointrader.co.za/'

  const askOrders = x(url, {
    askOrders: x('.orderUdSell', [
      {
        price: '.orderUdSPr',
        volume: '.orderUdSAm'
      }
    ])
  })

  return askOrders
}

const getAltcoinStatsBuyOrders = () => {
  const url = 'http://www.altcointrader.co.za/'

  const askOrders = x(url, {
    askOrders: x('.orderUdBuy', [
      {
        price: '.orderUdBPr',
        volume: '.orderUdBAm'
      }
    ])
  })

  return askOrders
}

module.exports = getAltcoinStatsBuyOrders
