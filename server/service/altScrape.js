var Xray = require('x-ray')
var x = Xray()

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
