var x = require('x-ray')()
const makeDriver = require('request-x-ray')

const options = {
  method: 'GET',
  jar: true,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
  }
}

const driver = makeDriver(options)

x.driver(driver)

const getAltcoinStats = () => {
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

module.exports = getAltcoinStats
