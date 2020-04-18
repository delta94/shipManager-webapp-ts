import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import styles from './style.less';
import { IManagerCert } from '@/interfaces/IManager';
import { useRequest } from '@umijs/hooks';
import { listManagerCertType } from '@/services/manager';
import FileUpload from '@/components/FileUpload';
import { OSSResourceType } from '@/utils/OSSClient';

interface ManagerCertEditFormModalProps {
  visible: boolean;
  current: Partial<IManagerCert> | undefined;
  onSubmit: (values: IManagerCert) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const ManagerCertEditFormModal: FC<ManagerCertEditFormModalProps> = ({
  visible,
  current,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const { data: certificateTypes } = useRequest(listManagerCertType, {
    manual: false,
  });

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        expiredAt: current.expiredAt ? moment(current.expiredAt) : null,
      });
    }
  }, [current]);

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      if (values.expiredAt) {
        values.expiredAt = values.expiredAt?.format('YYYY-MM-DD') ?? ''
      }
      if (values.typeId) {
        values.typeName = values.expiredAt?.format('YYYY-MM-DD') ?? ''
      }
      onSubmit(values as IManagerCert);
    }
  };

  return (
    <Modal
      title={current ? '编辑证书' : '添加证书'}
      className={styles.standardListForm}
      width={640}
      destroyOnClose
      visible={visible}
      okText="保存"
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="证书名"
          rules={[{ required: true, message: '请输入证书名称' }]}
        >
          <Input placeholder="请输入证书名称" />
        </Form.Item>
        <Form.Item
          name="identityNumber"
          label="证书编号"
          rules={[{ required: true, message: '请输入证书编号' }]}
        >
          <Input placeholder="请输入证书编号" />
        </Form.Item>

        <Form.Item
          name="expiredAt"
          label="证书过期时间"
          rules={[{ required: true, message: '请选择证书过期时间' }]}
        >
          <DatePicker
            placeholder="请选择证书过期日期"
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="typeId"
          label="证书类型"
          rules={[{ message: '请选择证书类型！', required: true }]}
        >
          <Select placeholder="请选择证书类型">
            {certificateTypes?.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="证书电子件" name="fileList">
          <FileUpload resourceType={OSSResourceType.ManagerCert} />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={4} placeholder="请输入证书备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManagerCertEditFormModal;
