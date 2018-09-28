import React from 'react'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Exchange',
    paraName: 'name',
    valueSelector: ([index, row]) => row.name
  },
  {
    heading: 'BTC/ZAR',
    paraName: 'price',
    valueSelector: ([index, row]) => row.price
  },
  {
    heading: 'Last Updated',
    paraName: 'lastUpdated',
    valueSelector: ([index, row]) => row.lastUpdated
  }
]

const headings = getHeadingsFromConfig(config)

const ExchangesTable = ({ exchangeData }) => {
  const rowData = !exchangeData.length ? [] : formatRowDataWithConfigSelectors(exchangeData, config)

  return <Table title="Exchanges" headings={headings} rows={rowData} />
}

export default ExchangesTable
