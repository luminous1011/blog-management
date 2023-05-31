import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, message, Input, DatePicker, Card, Col, Form, Modal, Upload } from 'antd';
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
import { rule, addRule, updateRule, removeRule, getList, insert, deleteById } from './service';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
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


const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


const TableList: React.FC = () => {

  const [data, setData] = useState([] as IEssay[]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [pagination, setPagination] = useState({} as IPagination)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([

  ]);
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
      key: 'url',
      align: "center",
      title: '图片',
      render: (_, record) => (_.url ? <img style={{ height: 100 }} src={_.url} /> : '暂无图片'),
    },
    {
      key: 'source',
      title: '来源',
      width: 120,
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
      key: 'infoId',
      align: "center",
      width: 160,
      render: (_, record) => [<a onClick={() => { }} style={{ marginRight: 5 }}>查看</a>, <a style={{ marginRight: 5 }}>编辑</a>, <a className='red' onClick={() => handleDelete(_.infoId)} >删除</a>],
    },
  ];

  const handleCancel = () => setPreviewOpen(false);
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
  async function handleDelete(id: number) {
    const res = await deleteById({ id })
    if (res && res.code === 0) {
      getListInfo()
      message.success(res.message)
      return
    }
    message.error(res.message)
  }
  async function modalOk() {
    const params = {
      ...form.getFieldsValue(),
      source: '生活时光机',
    }
    if (fileList.length) {
      params.url = fileList[0].response.url
    }
    const res = await insert(params)
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
    setFileList([])
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


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.error(newFileList);
  }


  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


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
            <Form.Item label="图片" name="url">
              <Upload
                action="http://localhost:8888/upload/img"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
              >
                {fileList.length >= 2 ? null : uploadButton}
              </Upload>
            </Form.Item>

          </Form>
        </Modal>
      </Context.Provider>

    </PageContainer>
  );
};

export default TableList;
