import { Button, message, Input, Drawer, Card, Col, Form, Row, Table } from 'antd';
import type { ColumnsType, ColumnType, ColumnGroupType } from 'antd/es/table';
import React, { useState, useContext, JSXElementConstructor } from 'react';
import TableLayoutHeader from './components/TableLayoutHeader'
import './index.less'
interface TableProps<T, H> {
    columns: ColumnType<object>[],
    data: object[],
    headerLeftSlot: Element,
    pagination: object
}

function TableWrapper<T, H>(props: TableProps<T, H>) {
    const { columns, data, pagination } = props


    return (
        <>
            <Card style={
                { marginTop: 24 }
            }>
                <Row className='table-header-slot'>
                    {props.headerLeftSlot}
                </Row>
                <Table bordered columns={columns} dataSource={data} pagination={props.pagination} />
            </Card>
        </>

    )
}

export default TableWrapper