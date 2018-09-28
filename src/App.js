import React, { Component } from 'react'
import { MarginTable, CurrencyTable, ExchangesTable, Table } from './components'
import io from 'socket.io-client'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lastPollUpdate: new Date(),
      currencies: [],
      exchangePrices: [],
      margins: []
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lastPollUpdate !== this.state.lastPollUpdate) {
      if (this.ticker) {
        clearInterval(this.ticker)
      }

      this.ticker = setInterval(() => {
        this.forceUpdate()
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.ticker)
  }

  _refreshStats() {
    this.socket.send('RESET')
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:5000')
    this.socket.on('message', message => {
      if (message) {
        const { currencies, exchangePrices, margins } = message

        this.setState({
          lastPollUpdate: new Date(),
          currencies,
          exchangePrices,
          margins
        })
      }
    })
  }

  render() {
    const { margins, currencies, exchangePrices, lastPollUpdate } = this.state

    const elapsedTime = Math.floor((new Date() - lastPollUpdate) / 1000)

    return [
      <div key={4} className="row mt-4">
        <button
          type="button"
          className="btn btn-primary text-center mx-auto"
          onClick={() => this._refreshStats()}
        >
          {`Click Here to Refresh (Updated ${elapsedTime} ago)`}
        </button>
      </div>,
      <MarginTable key={1} marginData={margins} />,
      <CurrencyTable key={2} title="Currencies" currencyData={currencies} />,
      <ExchangesTable key={3} title="Exchanges" exchangeData={exchangePrices} />
    ]
  }
}
