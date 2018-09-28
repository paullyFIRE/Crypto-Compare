import React from 'react'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Exchange A',
    paraName: 'exchangeA',
    valueSelector: ([index, row]) => `${row.exchangeA.name} (R ${row.exchangeA.price})`
  },
  {
    heading: 'Margin',
    paraName: 'margin',
    valueSelector: ([index, row]) => `${parseFloat((row.margin * 100).toFixed(2))} %`
  },
  {
    heading: 'Exchange B',
    paraName: 'exchangeB',
    valueSelector: ([index, row]) => `${row.exchangeB.name} (R ${row.exchangeB.price})`
  },
  {
    heading: 'Difference',
    paraName: 'difference',
    valueSelector: ([index, row]) => `R${row.difference}`
  }
]

const headings = getHeadingsFromConfig(config)

const MarginTable = ({ marginData }) => {
  const rowData = !marginData.length ? [] : formatRowDataWithConfigSelectors(marginData, config)

  return <Table title="BTC" headings={headings} rows={rowData} />
}

export default MarginTable
