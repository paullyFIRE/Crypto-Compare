import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

import React from 'react'
import { Table } from '../'
import { withRouter } from 'react-router-dom'

const config = [
  {
    heading: 'Buy Exchange',
    valueSelector: ([index, row]) => `${row.buy.name}`,
    link: ([index, row]) => `${row.buy.link}`
  },
  {
    heading: 'Sell Exchange',
    valueSelector: ([index, row]) => `${row.sell.name}`,
    link: ([index, row]) => `${row.sell.link}`
  },
  {
    heading: 'Volume',
    valueSelector: ([index, row]) => parseFloat(row.volume).toFixed(2)
  },
  {
    heading: 'Buy Amount (excl. fees) (R)',
    valueSelector: ([index, row]) => parseFloat(row.buy.transactionAmount).toFixed(2)
  },
  {
    heading: 'Sell Amount (excl. fees) (R)',
    valueSelector: ([index, row]) => parseFloat(row.sell.transactionAmount).toFixed(2)
  },
  {
    heading: 'Transaction Margin (%)',
    valueSelector: ([index, row]) => parseFloat(row.netMargin).toFixed(2)
  },
  {
    heading: 'Gross Difference (R)',
    valueSelector: ([index, row]) => parseFloat(row.netDifference).toFixed(2)
  }
]

const headings = getHeadingsFromConfig(config)

class MarginTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buyListVal: '',
      sellListVal: ''
    }

    this.onChangeBuyList = this.onChangeBuyList.bind(this)
    this.onChangeSellList = this.onChangeSellList.bind(this)
  }

  onChangeBuyList(value) {
    const el = value.nativeEvent.target
    const val = el[el.selectedIndex].value
    console.log('val: ', val)

    if (val === 'Select') {
      this.setState({ buyListVal: '' })
    }

    this.setState({ buyListVal: val })
  }

  onChangeSellList(value) {
    const el = value.nativeEvent.target
    const val = el[el.selectedIndex].value

    if (val === 'Select') {
      this.setState({ buyListVal: '' })
    }

    this.setState({ sellListVal: val })
  }

  render() {
    const { buyListVal, sellListVal } = this.state
    const { marginData = [], history } = this.props
    const rowData = formatRowDataWithConfigSelectors(marginData, config)
    const filteredRowData = rowData
      .filter(margin => {
        if (buyListVal === 'Select') return true

        if (buyListVal && margin[0] !== buyListVal) {
          return false
        }

        return true
      })
      .filter(margin => {
        if (sellListVal === 'Select') return true

        if (sellListVal && margin[1] !== sellListVal) {
          return false
        }

        return true
      })

    return [
      <div
        style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}
        className="container"
        key={1}
      >
        <label>Buy Exchange:</label>
        <select value={buyListVal} ref="buyExchange" className="" onChange={this.onChangeBuyList}>
          <option key={0}>Select</option>
          {marginData
            .reduce(
              (acc, margin) => (acc.includes(margin.buy.name) ? acc : [...acc, margin.buy.name]),
              []
            )
            .map((exch, i) => (
              <option key={i} value={exch}>
                {exch}
              </option>
            ))}
        </select>
        <label>Sell Exchange:</label>
        <select
          value={sellListVal}
          ref="sellExchange"
          className=""
          onChange={this.onChangeSellList}
        >
          <option key={0}>Select</option>
          {marginData
            .reduce(
              (acc, margin) => (acc.includes(margin.sell.name) ? acc : [...acc, margin.sell.name]),
              []
            )
            .map((exch, i) => (
              <option key={i} value={exch}>
                {exch}
              </option>
            ))}
        </select>
        <button
          onClick={() => this.setState({ buyListVal: '', sellListVal: '' })}
          value="Reset Filters"
        >
          Reset Filters
        </button>
      </div>,
      <Table key={2} title="Margins" headings={headings} rows={filteredRowData} history={history} />
    ]
  }
}

export default withRouter(MarginTable)
