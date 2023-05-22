import { Button, message, Input, Drawer, Card, Col, Form, Row, Table } from 'antd';
import type { ColumnsType, ColumnType, ColumnGroupType } from 'antd/es/table';
import React, { useState, useContext } from 'react';

interface TableProps<T> {
    columns: ColumnType<object>[],
    data: object[],
}

function TableWrapper<T>(props: TableProps<T>) {
    const { columns, data } = props


    return (
        <Card style={
            { marginTop: 24 }
        }>
            <Table bordered columns={columns} dataSource={data} />
            {/* 使用 JSX 风格的 API */}
            {/* <Table<User> dataSource={data}>
                <Table.Column<User> key="name" title="Name" dataIndex="name" />
            </Table> */}
        </Card>
    )
}

export default TableWrapper