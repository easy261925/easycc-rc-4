import React, { CSSProperties, ReactNode } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Tree, Input } from 'antd'
import { CCColumns } from '../interface'
import CCModal from '../Modal'
import { Member, tableListDataSource } from './data'
import './index.less'

interface CCModalTableProps {
  style?: CSSProperties
  onClickCallback?: () => void;
  buttonText?: string
  title?: string
  onFinish?: (values?: any) => Promise<any>;
  onClose?: () => void;
  footer?: ReactNode
  cancelText?: string
  okText?: string
  content?: ReactNode
  width?: number
  bodyStyle?: CSSProperties
  request?: (params: { [key: string]: any }) => Promise<any>;
}

const Index: React.FC<CCModalTableProps> = (props) => {
  const {
    style,
    children,
    onClickCallback,
    buttonText = '打开',
    title = 'ModalTable 标题',
    onFinish,
    onClose,
    footer,
    cancelText = '关闭',
    okText = '确定',
    content,
    width = 650,
    bodyStyle = {
      minHeight: 450,
    },
    request,
    ...ext
  } = props

  const columns: CCColumns<Member>[] = [
    {
      dataIndex: 'avatar',
      title: '成员名称',
      valueType: 'avatar',
      render: (dom, record) => (
        <Space>
          <span>{dom}</span>
          {record.nickName}
        </Space>
      ),
    },
    {
      dataIndex: 'email',
      title: '账号',
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      search: false,
    },
    {
      dataIndex: 'permission',
      title: '权限范围',
      search: false,
      render: (_, record) => {
        const { role, permission = [] } = record;
        if (role === 'admin') {
          return '所有权限';
        }
        return permission && permission.length > 0 ? permission.join('、') : '无';
      },
    },
  ];

  const contentRender = () => {
    return (
      <ProTable<Member>
        className='container'
        params={{
          pageSize: 10
        }}
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="outUserNo"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
          total: tableListDataSource.length
        }}
        toolBarRender={false}
        rowSelection={{
        }}
      />
    )
  }

  const renderSelectList = () => {
    return (
      <div>
        {/* <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(gData)}
        /> */}
      </div>
    )
  }

  return (
    <CCModal
      modalStyle={{ top: 10 }}
      title={title}
      content={content || contentRender()}
      bodyStyle={bodyStyle}
      width={850}
    >
      <Button>选择联系人</Button>
    </CCModal>
  )
}

export default Index
