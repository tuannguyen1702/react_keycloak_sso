import React, { Component } from 'react';
import { Table } from 'reactstrap';

class TableComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var { tableData, colData, handleView = null, handleEdit = null, haveHeader = false, haveFooter = false, startIndex = 0 , className = ""} = this.props
        return (
            <Table className={className}>
                <thead>
                    <tr>
                        {colData.map((col, rowItemIndex) => (
                            <th key={(rowItemIndex + 1)}>{col.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            {colData.map((col, rowItemIndex) => (
                                <td key={index + "_" + (rowItemIndex + 1)}>
                                    {className == 'mobile-tbl' ? <label className="mobile-lbl">{col.name}</label>:""}
                                    {
                                        col.binding ? col.binding(row, index) : row[col.mapData]
                                    }
                                </td>
                            ))}

                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

export default TableComponent