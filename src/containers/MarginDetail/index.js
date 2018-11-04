import React, { Component } from 'react'

export default class MarginDetail extends Component {
  render() {
    const {
      history,
      location: {
        state: { row, headings }
      }
    } = this.props

    return (
      <div onClick={() => history.goBack()} className="container">
        <h3 className="text-center mt-3 mb-3">{`${row[0]} - ${row[2]} - ${row[3]}`}</h3>
      </div>
    )
  }
}
