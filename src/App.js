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
  _refreshStats() {
    this.socket.send('RESET')
  }

  componentDidMount() {
    this.socket = io.connect(`/`)
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

    const exchangeData = []

    if (exchanges.sell) {
      exchangeData.push(...exchanges.sell)
    }
    if (exchanges.buy) {
      exchangeData.push(...exchanges.buy)
    }

    return [
      <Router key={1}>
        <div style={{ marginTop: 25 }}>
          <ul style={{ display: 'flex', justifyContent: 'center' }}>
            <li style={{ fontSize: 22 }}>
              <Link active={true} to="/">
                Home
              </Link>
            </li>
            <li style={{ marginLeft: 25, fontSize: 22 }}>
              <Link to="/currencies">Currencies</Link>
            </li>
            <li style={{ marginLeft: 25, fontSize: 22 }}>
              <Link to="/exchanges">Exchanges</Link>
            </li>
            <li style={{ marginLeft: 25, fontSize: 22 }}>
              <Link to="/margins">Margins</Link>
            </li>
          </ul>
          <div key={4} className="row mt-4">
            <button
              type="button"
              className="btn btn-primary text-center mx-auto"
              onClick={() => this._refreshStats()}
            >
              {`Click Here to Refresh`}
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
            render={() => <ExchangesTable key={3} title="Exchanges" exchangeData={exchangeData} />}
          />
        </div>
      </Router>
    ]
  }
}
