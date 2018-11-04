import React from 'react'
import { withRouter } from 'react-router-dom'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Buy Exchange',
    valueSelector: ([index, row]) => `${row.buy.name}`
  },
  {
    heading: 'Buy Amount (excl. fees) (R)',
    valueSelector: ([index, row]) => parseFloat(row.buy.transactionAmount).toFixed(2)
  },
  {
    heading: 'Sell Exchange',
    valueSelector: ([index, row]) => `${row.sell.name}`
  },
  {
    heading: 'Volume',
    valueSelector: ([index, row]) => parseFloat(row.volume).toFixed(2)
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
    heading: 'Transaction Profit (R)',
    valueSelector: ([index, row]) => parseFloat(row.netDifference).toFixed(2)
  },
  {
    heading: 'Total Fees (R)',
    valueSelector: ([index, row]) => parseFloat(row.totalFees).toFixed(2)
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
