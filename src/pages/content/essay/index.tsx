import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message, Input, DatePicker, Card, Col, Form, Modal } from 'antd';
import type { DatePickerProps } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
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
import { rule, addRule, updateRule, removeRule, getList, insert } from './service';
import type { IEssay } from './data';
import Context from '@/utils/context'
import './index.less';
import TextArea from 'antd/lib/input/TextArea';

type HeaderFormColumsItem = {
  name: string;
  label: string;
  placeholder?: string | undefined;
  type: 'input' | 'select' | 'date';
}
interface IPagination {
  total: number,
  current: number,
  pageSize: number,
  onChange: Function
}

const columns: ColumnsType = [
  {
    title: '序号',
    render: (text, record, index) => `${index + 1}`
  },
  {
    key: 'text',
    align: "center",
    title: '内容',
    dataIndex: 'text',
  },
  {
    key: 'source',
    title: '来源',
    align: "center",
    dataIndex: 'source',
  },
  {
    align: "center",
    key: 'createTime',
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    key: 'updateTime',
    title: '更新时间',
    align: "center",
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'infoId',
    align: "center",
    width: 160,
    render: (_, record) => [<a onClick={() => { }}>查看</a>, <a style={{ marginLeft: 5 }}>编辑</a>, <a className='red' style={{ marginLeft: 5 }}>删除</a>],
  },
];



const TableList: React.FC = () => {

  const [data, setData] = useState([] as IEssay[]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [pagination, setPagination] = useState({} as IPagination)
  const [form] = Form.useForm();
  const getData = async (page: number) => {
    const res = await getList({ page, pageSize: 10 });
    const { list, total, pageSize, pageNum } = res.data;
    setPagination({
      total,
      current: pageNum,
      pageSize,
      onChange(page: number) {
        getListInfo(page)
      }
    })
    return list;
  };
  useEffect(() => {
    getListInfo()
  }, []);
  async function getListInfo(page: number = 1) {
    getData(page).then((res) => setData([...res]));
  }

  function handleSearch(form: any) {
    console.error(form);

  }
  async function modalOk() {
    const res = await insert({ source: '生活时光机', ...form.getFieldsValue() })
    if (res && res.code === 0) {
      getListInfo()
      modalCancel()
      message.success(res.message)
      return
    }
    message.error(res.message)

  }
  function modalCancel() {
    setModalOpen(false)
    form.resetFields()
  }

  // 搜索表单项 []
  const headerFormColumns: HeaderFormColumsItem[] = [
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
  // if (searchFormColumns.length <= 3) {
  //   searchBtnCrtls.pop();
  // }





  return (
    <PageContainer>
      <Context.Provider value={{ handleSearch }}>
        <TableWrapper<IEssay, HeaderFormColumsItem> data={data} pagination={pagination} columns={columns} searchFormColumns={headerFormColumns} headerLeftSlot={<>
          <Button type='primary' onClick={() => setModalOpen(true)}>新增</Button>
          <Button type='primary' style={{ marginLeft: 10 }}>批量删除</Button>
        </>} />
        <Modal title="新增" open={isModalOpen} onOk={modalOk} onCancel={modalCancel}>
          <Form form={form}>
            <Form.Item label="内容" name="text">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Context.Provider>

    </PageContainer>
  );
};

export default TableList;
