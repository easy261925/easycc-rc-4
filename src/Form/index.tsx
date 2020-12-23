import React from 'react';
import {
  Col,
  Form,
  Row,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Upload,
  Button,
} from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { LayoutInterface, FormItemLayoutInterface, CCColumns } from '../interface';
import { isEmpty } from '../utils';
import PickerWithType from './PickerWithType';

interface CCFormProps {
  columns?: CCColumns<any>[];
  colLayout?: LayoutInterface;
  formItemLayout?: FormItemLayoutInterface;
  record?: any;
}

const valueTypeForDate = [
  'date',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateTime',
  'time',
];
const valueTypeForDateRange = ['dateRange', 'dateTimeRange'];

const CCForm: React.FC<CCFormProps> = ({
  columns = [],
  colLayout = { span: 24 },
  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  },
  record,
}) => {
  const renderFormItems = () => {
    if (columns && columns.length > 0) {
      const formItems = columns
        .filter((column) => column && !column.hideInForm && column.dataIndex !== 'option')
        .map((item: any, key) => {
          const newColLayout = {
            ...colLayout,
            ...item.formItem?.colLayout,
          };
          const newFormItemLayout = {
            ...formItemLayout,
            ...item.formItem?.formItemLayout,
          };

          let initialValue = null;
          if (record && get(record, String(item.dataIndex))) {
            initialValue = get(record, String(item.dataIndex));
          }

          const rules = item.formItem?.props?.rules || item.formItemProps?.rules;

          if (item.formItem?.props?.elType === 'upload') {
            const fileList = !isEmpty(initialValue) ? initialValue.map((file: any, index: number) => {
              let name = '';
              if (
                item.formItem?.props?.fileNameKey &&
                file[item.formItem?.props?.fileNameKey]
              ) {
                name = file[item.formItem?.props?.fileNameKey];
              } else if (!isEmpty(file.name)) {
                name = file.name;
              } else {
                name = `文件${index + 1}`;
              }
              return {
                ...file,
                uid: file.id || index,
                name,
                status: 'done'
              }
            }) : []
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    // console.log('Upload event:', e);
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                  initialValue={fileList}
                >
                  <Upload
                    name={item.dataIndex ? `${item.dataIndex}` : 'file'}
                    action={item.formItem?.props?.action || '/upload.do'}
                    listType={item.formItem?.props?.listType || 'text'}
                    multiple={item.formItem?.props?.multiple}
                    accept={item.formItem?.props?.accept}
                    {...item.formItem.props}
                  >
                    {item.formItem?.props?.children || (
                      <Button>上传文件</Button>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem?.props?.elType === 'switch') {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  valuePropName="checked"
                  initialValue={!isEmpty(initialValue) ? initialValue : false}
                >
                  <Switch />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType === 'digit') {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={!isEmpty(Number(initialValue)) ? Number(initialValue) : null}
                >
                  <InputNumber style={{ width: '100%' }} {...item.formItem?.props} />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType && valueTypeForDateRange.includes(item.valueType as string)) {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={
                    !isEmpty(initialValue) && initialValue.length > 0
                      ? [moment(initialValue[0]), moment(initialValue[1])]
                      : []
                  }
                >
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    showTime={item.valueType === 'dateTimeRange'}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueType && valueTypeForDate.includes(item.valueType as string)) {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={!isEmpty(initialValue) ? moment(initialValue) : null}
                >
                  <PickerWithType type={item.valueType} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            );
          }
          if (item.valueType === 'textarea') {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue}
                >
                  <Input.TextArea
                    allowClear
                    autoSize
                    maxLength={200}
                    showCount
                    {...item.formItem?.props}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (item.valueEnum && Object.keys(item.valueEnum).length > 0) {
            const selectKeys = Object.keys(item.valueEnum);
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue || []}
                >
                  <Select
                    mode={item.formItem?.props?.mode}
                    placeholder={item.formItem?.props?.placeholder}
                  >
                    {selectKeys.map((value) => {
                      return (
                        <Select.Option value={value} key={value}>
                          {item.valueEnum?.[value].text}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            );
          }

          if (item.formItem && item.formItem.element) {
            return (
              <Col key={key} {...newColLayout}>
                <Form.Item
                  shouldUpdate
                  label={item.title}
                  name={item.dataIndex}
                  {...newFormItemLayout}
                  {...item.formItemProps}
                  rules={rules}
                  initialValue={initialValue}
                >
                  {React.cloneElement(item.formItem?.element, {
                    ...item.formItemProps,
                    ...item.formItem.props,
                  })}
                </Form.Item>
              </Col>
            );
          }
          return null;
        });
      return formItems;
    }
    return null;
  };

  return <Row>{renderFormItems()}</Row>;
};

export default CCForm;
