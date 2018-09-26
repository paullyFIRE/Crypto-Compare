import React, { Component } from 'react'
import axios from 'axios'
import { MarginTable } from './components'

import { runFirstInterval } from './lib/helpers'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        pairData: {
          btc: [
            {
              askPrice: 6740,
              bidPrice: 6721,
              exchange: 'Yobit'
            },
            {
              askPrice: 6615,
              bidPrice: 6613,
              exchange: 'Kraken'
            },
            {
              askPrice: 6640,
              bidPrice: 6632,
              exchange: 'Bittrex'
            }
          ]
        }
      }
    }
  }

  componentDidMount() {
    var ws = new WebSocket('ws://localhost:5000/', 'echo-protocol')

    ws.onopen = function() {
      console.log('Connection open...')
    }

    ws.onmessage = function(evt) {
      console.log('Message received = ' + evt.data)
    }

    ws.onclose = function() {
      console.log('Connection closed...')
    }
  }

  // componentDidMount() {
  //   // Currrency
  //   this.currencyInterval = runFirstInterval(() => {
  //     axios
  //       .get(
  //         'http://free.currencyconverterapi.com/api/v5/convert?q=USD_ZAR&compact=y'
  //       )
  //       .then(resp => resp.data.USD_ZAR.val)
  //       .then(zarRate => this.setState({ zarRate }))
  //       .catch(err => console.log('error', err))
  //   }, 1000 * 60 * 15)
  //   // Luno API
  //   this.lunoPrice = runFirstInterval(() => {
  //     axios
  //       .get('https://api.mybitx.com/api/1/ticker?pair=XBTZAR')
  //       .then(resp => resp.data)
  //       .then(data => this.setState({ lunoData: data }))
  //       .catch(err => console.log('error', err))
  //   }, 1000 * 5)
  //   // Kraken API
  //   this.krakenPrice = runFirstInterval(() => {
  //     axios
  //       .get('https://api.mybitx.com/api/1/ticker?pair=XBTZAR')
  //       .then(resp => resp.data)
  //       .then(data => this.setState({ lunoData: data }))
  //       .catch(err => console.log('error', err))
  //   }, 1000 * 5)
  // }

  render() {
    console.log(this.state)
    return <MarginTable pair="btc" data={this.state.data.pairData.btc} />
  }
}
