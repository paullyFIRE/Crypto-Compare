import React, { Component } from 'react'

export default class CurrencyTable extends Component {
  _renderCurrencies() {
    return Object.entries(this.props.currencyData).map(([currency, data], index) => (
      <tr key={index}>
        <th scope="row">{`${currency}/ZAR`}</th>
        <td>{data.rate}</td>
        <td>{data.lastUpdated}</td>
      </tr>
    ))
  }

  render() {
    const { title, currencyData } = this.props

    return (
      <div className="container">
        <h3 className="text-center mt-3 mb-3">{title}</h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Currency</th>
              <th scope="col">Rate</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>{!currencyData || this._renderCurrencies()}</tbody>
        </table>
      </div>
    )
  }
}
