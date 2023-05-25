import React, { useContext } from 'react'
import { Card, Form, Row, Button, Input, Select, DatePicker, Col } from 'antd';
import { useState } from 'react';
import { SearchBtnCrtlsItem } from './components';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import Context from '@/utils/context';

interface IProps<H> {
    searchFormColumns: H[],
}

/**
  * 合并 搜索表单 Buttons 布局
  * @returns
  */
function TableLayoutHeader<H>(props: IProps<H>) {
    const { searchFormColumns, } = props
    const context = useContext(Context)

    const [visibleAll, setVisbleAll] = useState(false); // 搜索表单是否展示全部
    const [form] = Form.useForm(); // 搜索表单 form
    const loading = false
    const formStyle = {
        maxWidth: 'none',
        padding: 24,
    };
    const handleVisibleAll = () => {
        setVisbleAll(!visibleAll);
    };
    // 默认Buttons []
    const searchBtnCrtls: SearchBtnCrtlsItem[] = [
        {
            content: '重置',
            event: handleVisibleAll,
            type: 'default',
        },
        {
            content: '查询',
            type: 'primary',
            event: context.handleSearch.bind(null, form.getFieldsValue()),
            loading: true,
        },
        {
            content: '更多',
            type: 'link',
            visibleSwitch: true,
            event: handleVisibleAll,
        },
    ];

    /**
    * 渲染搜索表单
    * @returns
    */
    const getTableSearchHeaderColums = () => {
        const children = [];
        for (let i = 0; i < searchFormColumns.length; i++) {
            children.push(
                i < 3 || visibleAll ? (
                    <Col span={8} key={i}>
                        <Form.Item name={searchFormColumns[i].name} label={searchFormColumns[i].label}>
                            {/* {renderSearchFromColumns(searchFormColumns[i].type)} */}
                            {
                                searchFormColumns[i].type === 'input' ? <Input placeholder={'请输入'} /> : searchFormColumns[i].type === 'select' ? <Select
                                    defaultValue="lucy"
                                    options={[
                                        { value: 'jack', label: 'Jack' },
                                        { value: 'lucy', label: 'Lucy' },
                                        { value: 'Yiminghe', label: 'yiminghe' },
                                        { value: 'disabled', label: 'Disabled' },
                                    ]}
                                /> : <DatePicker />
                            }

                        </Form.Item>
                    </Col>
                ) : null,
            );
        }
        return children;
    };

    return (
        <Card>
            <Form form={form} name="tableSearchForm" style={formStyle}>
                <Row gutter={24}>{getTableSearchHeaderColums()}</Row>
                <Row className="tableSearchForm-crtls">
                    {searchBtnCrtls.map((item, i) =>
                        item.loading ? (
                            <Button type={item.type} loading={loading} onClick={item.event} key={i}>
                                {item.content}
                            </Button>
                        ) : (
                            <Button
                                type={item.type}
                                className={item.visibleSwitch ? 'visible-switch-btn' : ''}
                                onClick={item.event}
                                key={i}
                            >
                                {item.content}{' '}
                                {item.visibleSwitch ? visibleAll ? <UpOutlined /> : <DownOutlined /> : null}
                            </Button>
                        ),
                    )}
                </Row>
            </Form>
        </Card>
    );
};

export default TableLayoutHeader