import React from 'react'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sortIndex: 1,
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

  transformData(rows) {
    const { sortOrder, sortIndex } = this.state

    return rows.sort((a, b) =>
      sortOrder === 'ASC' ? a[sortIndex] - b[sortIndex] : b[sortIndex] - a[sortIndex]
    )
  }

  renderHeadings(headings) {
    return headings.map((heading, index) => (
      <th onClick={this.toggleSort} key={index} scope="col" className="text-center align-middle">
        {heading}
      </th>
    ))
  }

  renderRowItems(rowData) {
    return rowData.map((rowItem, index) => (
      <td key={index} scope={index === 0 ? 'row' : null} className="text-center align-middle">
        {rowItem}
      </td>
    ))
  }

  renderRows(rows) {
    return rows.map((row, index) => [<tr key={index}>{this.renderRowItems(row)}</tr>])
  }

  render() {
    const { title, headings, rows } = this.props

    return (
      <div className="container">
        <h3 className="text-center mt-3 mb-3">{title}</h3>

        <table className="table table-bordered table-hover table-sm">
          <thead className="thead-dark">
            <tr>{headings && this.renderHeadings(headings)}</tr>
          </thead>
          <tbody>{rows && this.renderRows(this.transformData(rows))}</tbody>
        </table>
      </div>
    )
  }
}

export default Table
