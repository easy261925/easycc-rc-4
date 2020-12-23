import { CSSProperties, ReactNode } from 'react';
import { Rule } from 'antd/lib/form';
import { LayoutInterface, FormItemLayoutInterface } from './layout';
import { ProColumnType } from '@ant-design/pro-table';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import { InputNumberProps } from 'antd/lib/input-number';
import { UploadProps } from 'antd/lib/upload';

interface FormItemPropsInterface {
  rules?: Rule[];
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  elType?: 'switch' | 'upload';
  fileNameKey?: string
}

export interface FormItemContent {
  colLayout?: LayoutInterface;
  formItemLayout?: FormItemLayoutInterface;
  element?: ReactNode | null | any;
  style?: CSSProperties;
  props?: FormItemPropsInterface & TextAreaProps & InputNumberProps & UploadProps;
}

export interface CCColumns<T> extends ProColumnType<T> {
  formItem?: FormItemContent;
}
