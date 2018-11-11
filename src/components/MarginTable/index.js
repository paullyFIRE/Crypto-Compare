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
    heading: 'Net Difference (R)',
    valueSelector: ([index, row]) => parseFloat(row.netDifference - row.totalFees).toFixed(2)
  }
]

const headings = getHeadingsFromConfig(config)

class MarginTable extends React.Component {
  render() {
    const { marginData = [], history } = this.props
    const rowData = formatRowDataWithConfigSelectors(marginData, config)

    return <Table title="Margins" headings={headings} rows={rowData} history={history} />
  }
}

export default withRouter(MarginTable)
