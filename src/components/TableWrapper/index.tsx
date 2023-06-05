import { Button, message, Input, Drawer, Card, Col, Form, Row, Table } from 'antd';
import type { ColumnsType, ColumnType, ColumnGroupType } from 'antd/es/table';
import React, { useState, useContext, JSXElementConstructor } from 'react';
import TableLayoutHeader from './components/TableLayoutHeader'
import './index.less'
import { GetRowKey } from 'antd/lib/table/interface';
interface TableProps<T, H> {
    columns: ColumnsType<object>,
    data: object[],
    headerLeftSlot: React.ReactNode,
    pagination: object,
    headerFormColumns: H[]
    bordered: boolean,
    rowSelection: object,
    rowKey: string | GetRowKey<object> | undefined
}
function TableWrapper<T, H>(props: TableProps<T, H>) {
    const { columns, data, pagination, bordered, rowKey, rowSelection } = props


    return (
        <>
            <Card style={
                { marginTop: 24 }
            }>
                <Row className='table-header-slot'>
                    {props.headerLeftSlot}
                </Row>
                <Table rowKey={rowKey} rowSelection={{ ...rowSelection }} bordered={bordered} columns={columns} dataSource={data} pagination={pagination} />
            </Card>
        </>

    )
}

export default TableWrapper