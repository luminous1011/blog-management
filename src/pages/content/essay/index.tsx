import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message, Input, DatePicker, Card, Col, Form, Row, Select } from 'antd';
import type { DatePickerProps } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import TableWrapper from '@/components/TableWrapper';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { rule, addRule, updateRule, removeRule, getList } from './service';
import type { SearchBtnCrtlsItem, IEssay, TableListItem, TableListPagination } from './data';
import './index.less';

const columns: ColumnType<object>[] = [
  {
    key: 'infoId',
    title: 'ID',
    dataIndex: 'infoId',
  },
  {
    key: 'text',
    title: '内容',
    dataIndex: 'text',
  },
  {
    key: 'source',
    title: '来源',
    dataIndex: 'source',
  },
  {
    key: 'createTime',
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    key: 'updateTime',
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'infoId',
    render: (_, record) => [<a onClick={() => {}}>查看</a>, <a>编辑</a>, <a>删除</a>],
  },
];
const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};
const getData = async () => {
  const res = await getList({ page: 1, pageSize: 10 });
  const { list } = res.data;
  return list;
};

const TableList: React.FC = () => {
  const [visibleAll, setVisbleAll] = useState(false);
  const [data, setData] = useState([] as IEssay[]);
  const [form] = Form.useForm();
  const loading = false;
  const formStyle = {
    maxWidth: 'none',
    padding: 24,
  };
  useEffect(() => {
    getData().then((res) => setData(res));
  }, []);

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
      event: handleVisibleAll,
      loading: true,
    },
    {
      content: '更多',
      type: 'link',
      visibleSwitch: true,
      event: handleVisibleAll,
    },
  ];
  // 搜索表单项 []
  const searchFormColumns: {
    name: string;
    label: string;
    placeholder?: string | undefined;
    type: 'input' | 'select' | 'date';
  }[] = [
    {
      name: 'text',
      label: '内容',
      type: 'input',
    },
    {
      name: 'source',
      label: '来源',
      type: 'select',
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'date',
    },
    {
      name: 'updateTime',
      label: '更新时间',
      type: 'date',
    },
  ];
  if (searchFormColumns.length <= 3) {
    searchBtnCrtls.pop();
  }

  const renderSearchFromColumns = (type: string) => {
    switch (type) {
      case 'input':
        return <Input placeholder={'请输入'} />;
      case 'select':
        return (
          <Select
            defaultValue="lucy"
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
        );
      case 'date':
        return <DatePicker onChange={onChange} />;
    }
  };
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
              {renderSearchFromColumns(searchFormColumns[i].type)}
              {/* <Input placeholder={searchFormColumns[i]?.placeholder || '请输入'} /> */}
            </Form.Item>
          </Col>
        ) : null,
      );
    }
    return children;
  };
  /**
   * 合并 搜索表单 Buttons 布局
   * @returns
   */
  const TableSearchHeader = () => {
    return (
      <Card>
        <Form form={form} name="tableSearchForm" style={formStyle}>
          <Row gutter={24}>{getTableSearchHeaderColums()}</Row>
          <Row className="tableSearchForm-crtls">
            {searchBtnCrtls.map((item) =>
              item.loading ? (
                <Button type={item.type} loading={loading} onClick={item.event}>
                  {item.content}
                </Button>
              ) : (
                <Button
                  type={item.type}
                  className={item.visibleSwitch ? 'visible-switch-btn' : ''}
                  onClick={item.event}
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

  return (
    <PageContainer>
      <TableSearchHeader />
      <TableWrapper<IEssay> data={data} columns={columns} />
    </PageContainer>
  );
};

export default TableList;
