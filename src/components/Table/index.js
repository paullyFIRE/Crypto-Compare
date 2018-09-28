import React, { Component } from 'react'

const renderHeadings = headings =>
  headings.map((heading, index) => (
    <th key={index} scope="col" className="text-center align-middle">
      {heading}
    </th>
  ))

const renderRowItems = rowData =>
  rowData.map((rowItem, index) => (
    <td key={index} scope={index === 0 ? 'row' : null} className="text-center align-middle">
      {rowItem}
    </td>
  ))

const renderRows = rows => rows.map((row, index) => <tr key={index}>{renderRowItems(row)}</tr>)

const Table = ({ title, headings, rows }) => (
  <div className="container">
    <h3 className="text-center mt-3 mb-3">{title}</h3>

    <table className="table table-bordered table-hover table-sm">
      <thead className="thead-dark">
        <tr>{headings && renderHeadings(headings)}</tr>
      </thead>
      <tbody>{rows && renderRows(rows)}</tbody>
    </table>
  </div>
)

export default Table
