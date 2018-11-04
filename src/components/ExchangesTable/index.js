import React from 'react'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Exchange',
    paraName: 'exchangeName',
    valueSelector: ([index, row]) => row.exchangeName
  },
  {
    heading: 'Exchange Type',
    paraName: 'type',
    valueSelector: ([index, row]) => row.type
  },
  {
    heading: 'Currency',
    paraName: 'currency',
    valueSelector: ([index, row]) => row.currency
  },
  {
    heading: 'Price',
    paraName: 'price',
    valueSelector: ([index, row]) => row.price && parseFloat(row.price).toFixed(2)
  },
  {
    heading: 'Fees (%)',
    paraName: 'fees',
    valueSelector: ([index, row]) => row.fees
  }
]

const headings = getHeadingsFromConfig(config)

const ExchangesTable = ({ exchangeData }) => {
  const rowData = !exchangeData.length ? [] : formatRowDataWithConfigSelectors(exchangeData, config)

  return <Table title="Exchanges" headings={headings} rows={rowData} />
}

export default ExchangesTable
