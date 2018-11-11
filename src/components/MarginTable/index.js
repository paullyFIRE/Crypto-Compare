import React from 'react'
import { withRouter } from 'react-router-dom'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

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
  },
  {
    heading: 'Total Fees + R30 (R)',
    valueSelector: ([index, row]) => parseFloat(row.totalFees + 30).toFixed(2)
  },
  {
    heading: 'Net Margin (%)',
    valueSelector: ([index, row]) =>
      parseFloat(
        ((row.sell.transactionAmount - row.buy.transactionAmount - row.totalFees) /
          row.buy.transactionAmount) *
          100
      ).toFixed(2)
  },
  {
    heading: 'Recycle Fees (Kraken/Luno Only)',
    valueSelector: ([index, row]) =>
      parseFloat((row.sell.transactionAmount - row.totalFees) * 0.0051).toFixed(2)
  },
  {
    heading: 'Net Profit (R)',
    valueSelector: ([index, row]) =>
      parseFloat(
        row.netDifference - row.totalFees - (row.sell.transactionAmount - row.totalFees) * 0.0051
      ).toFixed(2)
  },
  {
    heading: 'Net Profit (%)',
    valueSelector: ([index, row]) =>
      parseFloat(
        ((row.netDifference -
          row.totalFees -
          (row.sell.transactionAmount - row.totalFees) * 0.0051) /
          row.buy.transactionAmount) *
          100
      ).toFixed(2)
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
    this.setState({ buyListVal: val })
  }

  onChangeSellList(value) {
    const el = value.nativeEvent.target
    const val = el[el.selectedIndex].value
    this.setState({ sellListVal: val })
  }

  render() {
    const { buyListVal, sellListVal } = this.state
    const { marginData = [], history } = this.props
    const rowData = formatRowDataWithConfigSelectors(marginData, config)
    const filteredRowData = rowData.filter(margin => {
      if (buyListVal && margin[0] !== buyListVal) {
        return false
      } else if (sellListVal && margin[1] !== sellListVal) {
        return false
      }

      return true
    })

    return [
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }} className="container" key={1}>
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
