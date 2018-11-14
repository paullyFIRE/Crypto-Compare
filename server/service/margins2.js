const API = require('./api')
const { getAltcoinStats } = require('./altScrape')
const { weightedAveragePriceByThreshhold, compareWeightedAverage } = require('mstats')
const { compileApiCalls, startWithInterval } = require('./helpers')

const { currencies, exchanges, volumes } = require('../config')

const Margins = socket => {
  this.currencies = {}
  this.margins = []

  this.broadcast = () => {
    socket.send(this.getState())
  }

  this.updateCurrency = async () => {
    const api_rates = await Promise.all(
      currencies.map(currency => API.GET(currency.baseURL, currency.rateSelector))
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
    try {
      let exchangePrices

      exchangePrices = await Promise.all(compileApiCalls(exchanges, API.GET))

      const exchangesWithData = exchanges.map(
        ({ exchangeName, type, currency, apiData, ...configConsts }) => ({
          exchangeName,
          type,
          currency,
          lastUpdated: new Date().toString(),
          ...exchangePrices.reduce(
            (acc, { exchangeName: dataExchangeName, ...apiDataPoint }) =>
              exchangeName === dataExchangeName ? { ...acc, ...apiDataPoint } : acc,
            {}
          ),
          ...configConsts
        })
      )

      this.buyExchanges = exchangesWithData.filter(({ type }) => type === 'buy').map(mapMargins)
      this.sellExchanges = exchangesWithData.filter(({ type }) => type === 'sell').map(mapMargins)
      this.exchanges = exchangesWithData

      this.calculateMargins()
    } catch (err) {
      new Error(err.message)
    }
  }

  const mapMargins = exchange => {
    const { orders: marketBook, currency, fees } = exchange

    if (!marketBook) return { ...exchange, margins: [] }

    const exchangeMargins = volumes.map(volumeThreshhold => {
      const { price: marginPrice, orders } = weightedAveragePriceByThreshhold(
        marketBook,
        volumeThreshhold
      )

      const price = marginPrice * (currency !== 'ZAR' ? this.currencies[currency].rate : 1)

      const marginBase = {
        price: parseInt(price, 10),
        volume: volumeThreshhold,
        feesRate: null,
        fees: 0,
        orders
      }

      if (!fees && fees !== 0) return marginBase

      const baseFee = orders.reduce(
        (acc, marginOrder) =>
          acc + parseInt(marginOrder.price, 10) * parseFloat(marginOrder.volume),
        0
      )

      const adjustedFee =
        baseFee * (fees / 100) * (currency !== 'ZAR' ? this.currencies[currency].rate : 1)

      const transactionAmount = (price * volumeThreshhold - adjustedFee).toFixed(2)

      return { ...marginBase, transactionAmount, feesRate: fees, fees: adjustedFee.toFixed(2) }
    })

    return {
      ...exchange,
      exchangeMargins
    }
  }

  this.calculateMargins = () => {
    if (!this.buyExchanges || !this.sellExchanges) return

    const margins = this.sellExchanges.reduce(
      (acc, sellExch) => [
        ...acc,
        ...this.buyExchanges.reduce(
          (acc, buyExch) => [
            ...acc,
            ...volumes.map(volume => {
              const buy = buyExch.exchangeMargins.find(ex => ex.volume == volume)
              const sell = sellExch.exchangeMargins.find(ex => ex.volume == volume)

              const { margin, difference } = compareWeightedAverage(buy, sell)

              const netDifference = parseInt(sell.transactionAmount - buy.transactionAmount, 10)
              const netMargin = ((netDifference / buy.transactionAmount) * 100).toFixed(2)

              const totalFees = (parseFloat(buy.fees) + parseFloat(sell.fees)).toFixed(2)

              return {
                buy: {
                  name: buyExch.exchangeName,
                  ...buy
                },
                sell: {
                  name: sellExch.exchangeName,
                  ...sell
                },
                totalFees,
                netDifference,
                netMargin,
                margin,
                volume,
                difference
              }
            })
          ],
          []
        )
      ],
      []
    )

    this.margins = margins
    this.testTransaction()
    this.broadcast()
  }

  this.testTransaction = () => {
    getAltcoinStats()
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

  this.getState = flag => {
    const state = {
      currencies: this.currencies,
      exchanges: { buy: this.buyExchanges, sell: this.sellExchanges },
      margins: this.margins
    }

    if (!flag) {
      return state
    }

    return state[flag]
  }

  this.init()

  return {
    getState: this.getState,
    forceUpdate: this.forceUpdate,
    startPolls: this.startPolls,
    clearPolls: this.clearPolls
  }
}

module.exports = Margins
