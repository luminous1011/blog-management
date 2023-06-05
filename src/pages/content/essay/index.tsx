import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, message, Input, Form, Modal, Upload } from 'antd';
import React, { useState, useEffect, } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import TableWrapper from '@/components/TableWrapper';
import type { ColumnsType, } from 'antd/es/table';
import { getList, insert, deleteById, updateById, deleteByIds } from './service';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import type { IEssay } from './data';
import Context from '@/utils/context'
import { timestampToTime } from '@/utils/time'
import './index.less';

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

const { confirm } = Modal

const uploadButton = (
  <div>
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);
const TableList: React.FC = () => {
  const [data, setData] = useState([] as IEssay[]);
  const [isModalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState("新增")
  const [form] = Form.useForm();
  const [currentObj, setCurrentObj] = useState({} as IEssay)
  const [pagination, setPagination] = useState({} as IPagination)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const columns: ColumnsType<object> = [
    {
      title: '序号',
      key: 'infoId',
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
      render: (_, record) => timestampToTime(_),
    },
    {
      key: 'updateTime',
      title: '更新时间',
      align: "center",
      dataIndex: 'updateTime',
      render: (_, record) => timestampToTime(_),
    },
    {
      title: '操作',
      key: 'infoId',
      align: "center",
      width: 160,
      render: (_, record) => [
        <a onClick={() => { setTitle('查看'); handleViewOrEdit(_) }} style={{ marginRight: 5 }}>查看</a>,
        <a style={{ marginRight: 5 }} onClick={() => { setTitle('编辑'); handleViewOrEdit(_) }}>编辑</a>,
        <a className='red' onClick={() => handleDelete(_.infoId)} >删除</a>
      ],
    },
  ];

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

  /**
   * 获取列表
   * @param page 
   */
  async function getListInfo(page: number = 1) {
    getData(page).then((res) => setData([...res]));
  }

  function handleSearch(form: any) {
    console.error(form);
  }

  /**
   * 根据ID 删除列表数据
   * @param id 
   */
  async function handleDelete(id: number) {
    confirm({
      title: '请确认是否要删除该条数据 ? ',
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await deleteById({ id })
        if (res && res.code === 0) {
          getListInfo()
          message.success(res.message)
          return
        }
        message.error(res.message)
      },
      onCancel() {
        message.info("取消删除！")
      },
    })

  }

  /**
   * 点击 查看 || 编辑 
   * @param params 
   */
  async function handleViewOrEdit(params: IEssay) {
    setModalOpen(true)
    setCurrentObj(params)
    form.setFieldValue('text', params.text)
    const temp: UploadFile<any> = {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: params.url
    }
    params.url && setFileList([temp])
  }

  /**
   * 弹框 确认
   * @returns 
   */
  async function modalOk() {
    const params = {
      ...form.getFieldsValue(),
      source: '生活时光机',
    }
    if (fileList.length) {
      // 根据 是否有 originFileObj 字段判断是否是更新图片
      if (fileList[0].originFileObj) params.url = fileList[0].response.url
    }
    let res
    if (title !== "新增") {
      params.infoId = currentObj.infoId
      res = await updateById(params)
    } else {
      res = await insert(params)
    }
    if (res && res.code === 0) {
      getListInfo()
      modalCancel()
      message.success(res.message)
      return
    }
    message.error(res.message)

  }

  /**
   * 弹框 取消
   */
  function modalCancel() {
    setModalOpen(false)
    form.resetFields()
    setFileList([])
  }

  async function batchDeleteByIds() {
    confirm({
      title: '请确认是否要删除选中数据 ? ',
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await deleteByIds({ ids: selectedRowKeys })
        if (res && res.code === 0) {
          getListInfo()
          message.success(res.message)
          return
        }
        message.error(res.message)
      },
      onCancel() {
        message.info("取消删除！")
      },
    })
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
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <PageContainer>
      <Context.Provider value={{ handleSearch }}>
        <TableWrapper<IEssay, HeaderFormColumsItem> rowKey="infoId" bordered data={data} pagination={pagination} columns={columns} rowSelection={rowSelection} headerFormColumns={headerFormColumns} headerLeftSlot={[
          <Button type='primary' onClick={() => { setTitle('新增'); setModalOpen(true) }}>新增</Button>,
          <Button type='primary' style={{ marginLeft: 10 }} onClick={batchDeleteByIds}>批量删除</Button>
        ]} />
        <Modal title={title} open={isModalOpen} onOk={modalOk} onCancel={modalCancel}
          footer={[
            <Button onClick={modalCancel}>
              取消
            </Button>,
            title !== "查看" && <Button key="link" onClick={modalOk} type='primary'>
              提交
            </Button>,
          ]}
        >
          <Form form={form}>
            <Form.Item label="内容" name="text">
              <Input.TextArea rows={4} disabled={title === "查看"} />
            </Form.Item>
            <Form.Item label="图片" name="url">
              {title === "查看" && (currentObj.url ? <img style={{ width: 200 }} src={currentObj.url} /> : '暂无图片')}
              {
                title !== "查看" &&
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
              }
            </Form.Item>
          </Form>
        </Modal>
      </Context.Provider>

    </PageContainer >
  );
};

export default TableList;
