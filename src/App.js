import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { MarginTable, CurrencyTable, ExchangesTable, Table } from './components'
import { MarginDetail } from './containers'
import io from 'socket.io-client'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lastPollUpdate: new Date(),
      currencies: [],
      exchanges: [],
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
        console.log('message: ', message)
        const { currencies, exchanges, margins } = message

        this.setState({
          lastPollUpdate: new Date(),
          currencies,
          exchanges,
          margins
        })
      }
    })
  }

  render() {
    const { margins, currencies, exchanges, lastPollUpdate } = this.state

    const elapsedTime = Math.floor((new Date() - lastPollUpdate) / 1000)

    return [
      <Router key={1}>
        <div>
          <ul>
            <li>
              <Link active={true} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link to="/currencies">Currencies</Link>
            </li>
            <li>
              <Link to="/exchanges">Exchanges</Link>
            </li>
            <li>
              <Link to="/margins">Margins</Link>
            </li>
          </ul>
          <div key={4} className="row mt-4">
            <button
              type="button"
              className="btn btn-primary text-center mx-auto"
              onClick={() => this._refreshStats()}
            >
              {`Click Here to Refresh (Updated ${elapsedTime} ago)`}
            </button>
          </div>

          <hr />

          <Route exact path="/" component={null} />
          <Route
            path="/currencies"
            render={() => <CurrencyTable title="Currencies" currencyData={currencies} />}
          />
          <Route
            path="/margins"
            render={() => <MarginTable key={1} title="Margins" marginData={margins} />}
          />
          <Route path="/margin" component={MarginDetail} />
          <Route
            path="/exchanges"
            render={() => (
              <ExchangesTable
                key={3}
                title="Exchanges"
                exchangeData={[...exchanges.buy, ...exchanges.sell]}
              />
            )}
          />
        </div>
      </Router>
    ]
  }
}
