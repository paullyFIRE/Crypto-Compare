const API = require('./api')
const { apiCall } = API

const { currencies, exchanges } = require('../config')

const startWithInterval = (fn, duration) => {
  fn()
  return setInterval(() => fn(), duration)
}

const Margins = socket => {
  this.currencies = {}
  this.exchangeStats = []
  this.margins = []

  this.broadcast = () => {
    socket.send({
      currencies: this.currencies,
      exchangePrices: this.exchangeStats,
      margins: this.margins
    })
  }

  this.updateCurrency = async () => {
    const api_rates = await Promise.all(
      currencies.map(currency => apiCall(currency.baseURL, currency.rateSelector))
    )

    const lastUpdated = new Date().toString()

    const rates = currencies
      .map((currency, index) => ({
        [currency.name]: {
          rate: api_rates[index],
          lastUpdated
        }
      }))
      .reduce((acc, item) => (acc = Object.assign(acc, { ...item })), {})

    this.currencies = {
      ...this.currencies,
      ...rates
    }

    this.calculateMargins()
  }

  this.pollPrices = async () => {
    let exchangePrices
    try {
      exchangePrices = await Promise.all(
        exchanges.map(exchange => apiCall(exchange.baseURL, exchange.priceSelector))
      )
    } catch (err) {
      new Error(err.message)
    }

    const lastUpdated = new Date().toString()

    const exchangeStats = exchanges.map((exchange, index) => {
      const exchangeApiData = exchangePrices[index]

      if (exchangeApiData) {
        return {
          name: exchange.exchangeName,
          price: parseInt(
            exchangeApiData *
              (exchange.currency !== 'ZAR' ? this.currencies[exchange.currency].rate : 1),
            10
          ),
          lastUpdated
        }
      }

      return this.exchangeStats[index] || {}
    })

    this.exchangeStats = exchangeStats

    this.calculateMargins()
  }

  this.calculateMargins = () => {
    const marginData = []

    for (let a = 0; a < this.exchangeStats.length - 1; a++) {
      for (let b = a; b < this.exchangeStats.length; b++) {
        const exchangeA = this.exchangeStats[a]
        const exchangeB = this.exchangeStats[b]

        exchangeA.name === exchangeB.name ||
          marginData.push({
            exchangeA,
            exchangeB,
            difference: Math.abs(exchangeA.price - exchangeB.price),
            margin:
              Math.abs(exchangeA.price - exchangeB.price) /
              Math.min(exchangeA.price, exchangeB.price)
          })
      }
    }

    this.margins = marginData

    this.broadcast()
  }

  this.forceUpdate = () => {
    this.clearPolls()
    this.startPolls()
  }

  this.clearPolls = () => {
    clearInterval(this.zarInterval)
    clearInterval(this.marginIntervals)
  }

  this.startPolls = () => {
    this.zarInterval = startWithInterval(this.updateCurrency, 1000 * 60 * 15)
    this.marginIntervals = startWithInterval(this.pollPrices, 1000 * 30)
  }

  this.init = async () => {
    this.socket = socket
    this.startPolls()
  }

  this.init()

  return {
    getState: () => ({
      currencies: this.currencies,
      exchangePrices: this.exchangeStats,
      margins: this.margins
    }),
    forceUpdate: this.forceUpdate,
    startPolls: this.startPolls,
    clearPolls: this.clearPolls
  }
}

module.exports = Margins
