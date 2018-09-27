import React, { Component } from 'react'

export default class ExchangesTable extends Component {
  _renderExchangePrices() {
    return this.props.exchangeData.map(({ name, price, lastUpdated }, index) => (
      <tr key={index}>
        <th scope="row">{name}</th>
        <td>{price}</td>
        <td>{lastUpdated}</td>
      </tr>
    ))
  }

  render() {
    const { title, exchangeData } = this.props

    return (
      <div className="container">
        <h3 className="text-center mt-3 mb-3">{title}</h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Exchange</th>
              <th scope="col">BTC Rate/ZAR</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>{!exchangeData || this._renderExchangePrices()}</tbody>
        </table>
      </div>
    )
  }
}
