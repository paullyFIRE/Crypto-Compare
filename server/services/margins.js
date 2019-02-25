const API = require('./api')
const { weightedAveragePriceByThreshhold, compareWeightedAverage } = require('mstats')
const {
  compileApiCalls,
  startWithInterval,
  getVolumeOrders,
  calculateWeightedMean
} = require('./helpers')

const { currencies, exchanges, volumes } = require('../config')

const Margins = socket => {
  this.currencies = {}
  this.margins = []

  this.broadcast = message => {
    socket.send(message || this.getState())
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

      exchangePrices = await Promise.all(compileApiCalls(exchanges, API.GET, API.SCRAPE))

      const exchangesWithData = exchanges
        .map(({ exchangeName, type, currency, apiData, ...configConsts }) => ({
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
        }))
        .map(({ postApiData, ...exchKeys }) => {
          if (!postApiData) return { ...exchKeys }

          return {
            ...exchKeys,
            ...postApiData.reduce(
              (acc, point) => ({ ...acc, [point.dataLabel]: point.selector(exchKeys) }),
              {}
            )
          }
        })

      this.buyExchanges = exchangesWithData.filter(({ type }) => type === 'buy').map(mapMargins)
      this.sellExchanges = exchangesWithData.filter(({ type }) => type === 'sell').map(mapMargins)
      this.exchanges = exchangesWithData

      // this.testTransactions()
      this.calculateMargins()
    } catch (err) {
      new Error(err.message)
    }
  }

  const mapMargins = exchange => {
    const { orders: marketBook, currency, fees } = exchange

    if (!marketBook || !marketBook.length) return { ...exchange, margins: [] }

    const exchangeMargins = volumes.map(volumeThreshhold => {
      const { price: marginPrice, orders } = weightedAveragePriceByThreshhold(
        marketBook,
        volumeThreshhold
      )

      const price =
        marginPrice && marginPrice * (currency !== 'ZAR' ? this.currencies[currency].rate : 1)

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
    // this.testTransactions()
    this.broadcast()
  }

  this.testTransactions = () => {
    const ethOrders = [
      { price: '2705.00000000', volume: '6.65053000' },
      { price: '2709.99000000', volume: '1.34281199' },
      { price: '2724.99999999', volume: '0.65900812' },
      { price: '2748.00000000', volume: '0.99000000' },
      { price: '2749.00000000', volume: '1.26067899' },
      { price: '2790.00000000', volume: '1.08676319' },
      { price: '2850.00000000', volume: '0.01775680' },
      { price: '2965.00000000', volume: '0.23054126' },
      { price: '2977.99000000', volume: '1.21795482' },
      { price: '2990.00000000', volume: '0.55805387' },
      { price: '2999.99000000', volume: '0.16119813' },
      { price: '3000.00000000', volume: '1.20000000' },
      { price: '3050.00000000', volume: '0.02000000' },
      { price: '3080.00000000', volume: '0.01463898' },
      { price: '3090.00000000', volume: '0.05381566' },
      { price: '3100.00000000', volume: '0.01800363' },
      { price: '3125.00000000', volume: '0.00833280' },
      { price: '3139.79000000', volume: '0.37277397' },
      { price: '3144.90000000', volume: '2.32128000' },
      { price: '3145.00000000', volume: '0.09725491' }
    ]
    const ethPrice = ethOrders[0].price

    // console.log(this.buyExchanges)
    const alt = require('./testData')
    // const exchangeAlt = this.sellExchanges.find(exch => exch.exchangeName === 'AltcoinTrader')
    const exchangeAlt = alt
    const exchangeKraken = this.buyExchanges.find(exch => exch.exchangeName === 'Kraken')

    const initialBTC = 0.05
    // const balanceAfterBTCTransfer = initialBTC * 0.99
    const balanceAfterBTCTransfer = initialBTC
    // const zarFromBTC = balanceAfterBTCTransfer * exchangeAlt.price * 0.992
    const zarFromBTC = balanceAfterBTCTransfer * exchangeAlt.price

    console.log('exchangeAlt.ethPrice: ', ethPrice)
    // const ETHFromZar = (zarFromBTC / ethPrice) * 0.992
    const ETHFromZar = zarFromBTC / ethPrice
    console.log('ETHFromZar: ', ETHFromZar)

    const { orders, availableVolume } = getVolumeOrders(ethOrders, ETHFromZar)
    const ethAvgPrice = calculateWeightedMean(orders, availableVolume)
    console.log('ethAvgPrice: ', ethAvgPrice)
    // const ethAfterEthTransfer = ETHFromZar - 0.01
    const ethAfterEthTransfer = ETHFromZar
    console.log('ethAfterEthTransfer: ', ethAfterEthTransfer)

    const btcOnKraken = ethAfterEthTransfer * exchangeKraken.ethPrice
    console.log('btcOnKraken: ', btcOnKraken)
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
    this.marginIntervals = startWithInterval(this.pollPrices, 1000 * 60 * 2.5)
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
