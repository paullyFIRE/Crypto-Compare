import React from 'react'
import { Table } from '../'

import { formatRowDataWithConfigSelectors, getHeadingsFromConfig } from '../../lib/helpers'

const config = [
  {
    heading: 'Buy Exchange',
    valueSelector: ([index, row]) => `${row.buy.name}`
  },
  {
    heading: 'Buy Amount (excl. fees)',
    valueSelector: ([index, row]) => `${row.buy.transactionAmount}`
  },
  {
    heading: 'Sell Exchange',
    valueSelector: ([index, row]) => `${row.sell.name}`
  },
  {
    heading: 'Volume',
    valueSelector: ([index, row]) => `${row.volume}`
  },
  {
    heading: 'Buy Amount (excl. fees)',
    valueSelector: ([index, row]) => `${row.sell.transactionAmount}`
  },
  {
    heading: 'Transaction Margin',
    valueSelector: ([index, row]) => `${row.netMargin}`
  },
  {
    heading: 'Transaction Profit',
    valueSelector: ([index, row]) => `${row.netDifference}`
  },
  {
    heading: 'Total Fees',
    valueSelector: ([index, row]) => `${row.totalFees}`
  }
]

const headings = getHeadingsFromConfig(config)

class MarginTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sortIndex: 3,
      sortOrder: 'ASC'
    }

    this.toggleSort = this.toggleSort.bind(this)
  }

  toggleSort(index) {
    const columnIndex = index.nativeEvent.srcElement.cellIndex

    const { sortOrder, sortIndex } = this.state
    const oppositeOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC'

    this.setState(prevState => {
      const nextOrder = sortIndex !== prevState.sortIndex ? sortOrder : oppositeOrder

      return {
        sortIndex: columnIndex,
        sortOrder: nextOrder
      }
    })
  }

  render() {
    const { marginData = [] } = this.props
    const { sortIndex, sortOrder } = this.state
    const rowData = formatRowDataWithConfigSelectors(marginData, config)

    const sortedData = rowData.sort(
      (a, b) => (sortOrder === 'ASC' ? a[sortIndex] - b[sortIndex] : b[sortIndex] - a[sortIndex])
    )

    return <Table sortFn={this.toggleSort} title="Margins" headings={headings} rows={sortedData} />
  }
}

export default MarginTable
