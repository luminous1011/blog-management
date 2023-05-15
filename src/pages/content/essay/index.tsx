import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Card, Col, Form, Row } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule, getList } from './service';
import type { SearchBtnCrtlsItem, TableListItem, TableListPagination } from './data';
import './index.less'
getList({ page: 1, pageSize: 10 })


const TableList: React.FC = () => {
  const [visibleAll, setVisbleAll] = useState(false)
  const [form] = Form.useForm();
  const loading = false
  const formStyle = {
    maxWidth: 'none',
    padding: 24,
  };


  const handleVisibleAll = () => {
    console.error(form.getFieldsValue());
    setVisbleAll(!visibleAll)
  }
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
      event: handleVisibleAll
    },
  ]
  // 搜索表单项 []
  const searchFormCloums: {
    name: string,
    label: string,
    placeholder?: string | undefined
  }[] = [
      {
        name: 'source',
        label: '来源',
      }
    ]
  if (searchFormCloums.length <= 3) {
    searchBtnCrtls.pop()
  }
  /**
   * 渲染搜索表单
   * @returns 
   */
  const getTableSearchHeaderColums = () => {
    const children = []
    for (let i = 0; i < searchFormCloums.length; i++) {
      children.push(
        i < 3 || visibleAll ?
          <Col span={8} key={i}>
            <Form.Item
              name={searchFormCloums[i].name}
              label={searchFormCloums[i].label}
            >
              <Input placeholder={searchFormCloums[i]?.placeholder || '请输入'} />
            </Form.Item>
          </Col>
          : null
      )
    }
    return children
  }
  /**
   * 合并 搜索表单 Buttons 布局
   * @returns 
   */
  const TableSearchHeader = () => {
    return (
      <Card>
        <Form form={form} name="tableSearchForm" style={formStyle} >
          <Row gutter={24} >{getTableSearchHeaderColums()}</Row>
          <Row className='tableSearchForm-crtls' >
            {
              searchBtnCrtls.map((item) => (
                item.loading ?
                  <Button type={item.type} loading={loading} onClick={item.event}>
                    {item.content}
                  </Button>
                  :
                  <Button type={item.type} className={item.visibleSwitch ? 'visible-switch-btn' : ''} onClick={item.event}>
                    {item.content} {
                      item.visibleSwitch ? visibleAll ? <UpOutlined /> : <DownOutlined /> : null
                    }
                  </Button>
              ))
            }
          </Row>
        </Form>
      </Card >
    )
  }

  return (
    <PageContainer>
      <TableSearchHeader />
    </PageContainer>
  );
};

export default TableList;
