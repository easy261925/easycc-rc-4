## Drawer

Demo:

```tsx
import React, { Fragment } from 'react';
import { CCDrawer, FormModeEnum } from 'easycc-rc-4';
import { Button, Divider, Input, Form } from 'antd';
const multipleEnum = {
  a: { text: '多选项0', status: 'Default' },
  b: { text: '多选项1', status: 'Processing' },
  c: { text: '多选项2', status: 'Success' },
  d: { text: '多选项3', status: 'Error' },
};

const record = {
  id: 1,
  dateRange: [1608711421789, 1608711421789],
  digit: 99,
  dtCreaDateTime: 1608711421789,
  dtUpdateDateTime: 1608711421789,
  multiple: ['a', 'c'],
  password: '123456',
  select: '1',
  switch: false,
  textarea: '这是一段文字',
  uploadFile: [
    {
      id: '1',
      url:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ],
  username: '用户名',
};

const Index = () => {
  const columns: CCColumns<TestInterface>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      tooltip: '用户名',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
      render: (dom, entity) => (
        <CCDrawer
          formmode={FormModeEnum.view}
          columns={columns}
          record={entity}
        >
          <a>{dom}</a>
        </CCDrawer>
      ),
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 16,
          },
        },
        element: <Input placeholder="请输入用户名" />,
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      tooltip: 'password',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请填写密码',
          },
        ],
      },
      hideInTable: true,
      formItem: {
        colLayout: { span: 12 },
        formItemLayout: {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 16,
          },
        },
        element: <Input.Password placeholder="请输入密码" />,
      },
    },
    {
      title: '多行文本',
      dataIndex: 'textarea',
      tooltip: '这是多行文本',
      valueType: 'textarea',
      ellipsis: true,
      formItem: {
        props: {
          placeholder: '请输入多行文本',
          autoSize: {
            minRows: 4,
            maxRows: 6,
          },
        },
      },
      // hideInTable: true,
      // formItem: {
      //   element: <Input.TextArea placeholder="请输入多行文本" />,
      // },
    },
    {
      title: '选择',
      dataIndex: 'select',
      tooltip: '这是选择',
      valueEnum: {
        0: { text: '选项0', status: 'Default' },
        1: { text: '选项1', status: 'Processing' },
        2: { text: '选项2', status: 'Success' },
        3: { text: '选项3', status: 'Error' },
      },
      formItem: {
        props: {
          placeholder: '请单选',
          rules: [
            {
              required: true,
              message: '请选择选项',
            },
          ],
        },
      },
    },
    {
      title: '多选',
      dataIndex: 'multiple',
      valueEnum: multipleEnum,
      renderText: val =>
        val ? val.map((item: string) => multipleEnum[item].text).join(',') : '',
      formItem: {
        props: {
          mode: 'multiple',
          placeholder: '请多选',
          rules: [
            {
              required: true,
            },
          ],
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'dtCreaDateTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '选择时间',
      dataIndex: 'dateRange',
      search: false,
      valueType: 'dateTimeRange',
    },
    {
      title: '数字',
      dataIndex: 'digit',
      search: false,
      valueType: 'digit',
      formItem: {
        props: {
          max: 20,
        },
      },
    },
    {
      title: '切换',
      dataIndex: 'switch',
      formItem: {
        props: {
          elType: 'switch',
        },
      },
      search: false,
      hideInTable: true,
      render: val => (val ? '选中' : '未选中'),
    },
    {
      title: '上传图片',
      dataIndex: 'uploadFile',
      search: false,
      formItem: {
        props: {
          elType: 'upload',
          action: '/upload.do',
          // listType: 'picture',
          multiple: true,
          fileNameKey: 'fileName',
          // children: <a>上传文件</a>,
        },
      },
      hideInTable: true,
      renderText: (val, entity) => {
        if (entity.uploadFile && entity.uploadFile.length > 0) {
          return entity.uploadFile.map(file => {
            return <img src={file.url} key={file.id} style={{ width: 40 }} />;
          });
        }
        return null;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => (
        <Fragment>
          <CCDrawer
            formmode={FormModeEnum.update}
            columns={columns}
            record={entity}
            onFinish={onFinish}
          >
            <a>修改</a>
          </CCDrawer>
          <Divider type="vertical" />
          <a>删除</a>
        </Fragment>
      ),
    },
  ];

  const onFinish = values => {
    console.log('onFinish', values);
  };

  return (
    <div>
      <CCDrawer
        onFinish={onFinish}
        formmode={FormModeEnum.create}
        columns={columns}
        record={null}
      >
        <Button type="primary">新建</Button>
      </CCDrawer>
      <CCDrawer
        onFinish={onFinish}
        formmode={FormModeEnum.update}
        columns={columns}
        record={record}
        style={{ margin: '0 10px' }}
      >
        <Button>修改</Button>
      </CCDrawer>
      <CCDrawer
        onFinish={onFinish}
        formmode={FormModeEnum.view}
        columns={columns}
        record={record}
      >
        <a>查看</a>
      </CCDrawer>
    </div>
  );
};

export default Index;
```
