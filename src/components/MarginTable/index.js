import React, { Component } from 'react'

export default class MarginTable extends Component {
  _renderMargins() {
    return this.props.marginData.map((margin, index) => {
      const { exchangeA, exchangeB, difference, margin: marginStat } = margin

      return (
        <tr key={index}>
          <th scope="row">{`${exchangeA.name} (${exchangeA.price})`}</th>
          <td>{`${parseFloat((marginStat * 100).toFixed(2))} %`}</td>
          <td>{`${exchangeB.name} (${exchangeB.price})`}</td>
          <td>{difference}</td>
        </tr>
      )
    })
  }

  render() {
    const { marginData } = this.props

    return (
      <div className="container">
        <h3 className="text-center text-uppercase mt-3 mb-3">{this.props.pair}</h3>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Exchange A</th>
              <th scope="col">Margin</th>
              <th scope="col">Exchange B</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>{!marginData || this._renderMargins()}</tbody>
        </table>
      </div>
    )
  }
}
