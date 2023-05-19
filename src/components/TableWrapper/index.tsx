import { Button, message, Input, Drawer, Card, Col, Form, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState, useRef } from 'react';

interface TableProps {
    columns: [],
    data: [],
}

const TableWrapper: React.FC = (props: TableProps) => {
    console.warn(props);
    const { columns, data } = props
    console.error(columns, data);

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