import React, { useState, ReactNode, Fragment, CSSProperties } from 'react';
import { Drawer, Button, Row, Form } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FormModeEnum, FormModeLabelEnum } from '../interface';
import { DrawerProps } from 'antd/lib/drawer';
import { ProColumns } from '@ant-design/pro-table';
import styles from './index.less';
import CCForm from '../Form';

interface CCDrawerProps {
  propsVisible?: boolean;
  formmode?: FormModeEnum;
  title?: string;
  onClose?: () => void;
  footer?: ReactNode;
  loading?: boolean;
  onFinish?: (values?: any) => void;
  columns?: ProColumns<any>[];
  record?: any;
  onClickCallback?: () => void;
  descriptionsProps?: {
    column: number;
    title: string;
    request: (params: { [key: string]: any }) => Promise<any>;
    params: Object;
    columns: ProColumns<any>[];
  };
  bodyStyle?: CSSProperties
  style?: CSSProperties
}

const CCDrawer: React.FC<CCDrawerProps & DrawerProps> = (props) => {
  const {
    propsVisible,
    children,
    title = '抽屉',
    formmode = FormModeEnum.view,
    width = 650,
    placement,
    closable = true,
    onClose,
    onFinish,
    footer,
    loading,
    columns,
    record,
    destroyOnClose = true,
    onClickCallback,
    descriptionsProps,
    bodyStyle = { marginBottom: 24 },
    style,
    ...ext
  } = props;
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();

  const onClosed = () => {
    if (formmode !== FormModeEnum.view) {
      form.resetFields();
    }
    if (onClose) {
      onClose();
      setVisible(false);
    } else {
      setVisible(false);
    }
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      if (onFinish) {
        onFinish(values);
        setVisible(false);
      }
    });
  };

  let showTitle = null;
  if (formmode) {
    if (formmode !== FormModeEnum.view) {
      showTitle = `${FormModeLabelEnum[formmode]}${title}`;
    } else {
      showTitle = null;
    }
  } else {
    showTitle = title;
  }

  return (
    <div style={{ display: 'inline-block', ...style }}>
      {children ? (
        <Fragment>
          {React.cloneElement(children as any, {
            onClick: () => {
              if (onClickCallback) {
                onClickCallback();
              }
              setVisible(true);
            },
            style: { display: 'inline-block' },
          })}
        </Fragment>
      ) : (
          <Button
            type="primary"
            onClick={() => {
              if (onClickCallback) {
                onClickCallback();
              }
              setVisible(true);
            }}
          >
            打开
          </Button>
        )}

      <Drawer
        title={showTitle}
        placement={placement}
        width={width}
        closable={formmode === FormModeEnum.view ? false : closable}
        onClose={onClosed}
        visible={visible}
        destroyOnClose={destroyOnClose}
        bodyStyle={bodyStyle}
        {...ext}
      >
        {formmode === FormModeEnum.view ? (
          <ProDescriptions<any>
            column={2}
            title={record?.username}
            request={async () => ({
              data: record || {},
            })}
            params={{
              id: record?.username,
            }}
            columns={columns}
            {...descriptionsProps}
          />
        ) : (
            <Form form={form}>
              <CCForm columns={columns} record={record} />
            </Form>
          )}
        <div style={{ width }} className={styles.btnWrap}>
          {footer || (
            <Fragment>
              {formmode === FormModeEnum.view ? (
                <Button onClick={onClosed}>关闭</Button>
              ) : (
                  <Row>
                    <Button onClick={onClosed}>取消</Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: 8 }}
                      onClick={onSubmit}
                      loading={loading}
                    >
                      确定
                  </Button>
                  </Row>
                )}
            </Fragment>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default CCDrawer;
