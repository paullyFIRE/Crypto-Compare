import React from 'react'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Currency',
    valueSelector: ([currency, data]) => `${currency}/ZAR`
  },
  {
    heading: 'Rate',
    valueSelector: ([currency, data]) => data.rate
  },
  {
    heading: 'Last Updated',
    valueSelector: ([currency, data]) => data.lastUpdated
  }
]

const headings = getHeadingsFromConfig(config)

const CurrencyTable = ({ currencyData, title }) => {
  // const rowData = !currencyData.length ? [] : formatRowDataWithConfigSelectors(currencyData, config)
  const rowData = formatRowDataWithConfigSelectors(currencyData, config)

  return <Table title={title} headings={headings} rows={rowData} />
}

export default CurrencyTable
