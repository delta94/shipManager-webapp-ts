import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { CompanyKeyMap as CompanyKeys, updateCompanyInfo } from '@/services/companyService';
import { useRequest } from '@umijs/hooks';
import styles from './style.less';
import { ICompany } from '@/interfaces/ICompany';

interface EditContactFormProps {
  company?: ICompany;
  onUpdate: Function;
  onCancel: Function;
}

const EditContactForm: React.FC<EditContactFormProps> = ({ company, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  const { loading, run: updateCompany } = useRequest(updateCompanyInfo, {
    manual: true,
    onSuccess() {
      message.success('企业联系信息已更新');
      onUpdate();
    },
    onError() {
      message.error('企业联系信息更新失败');
    },
  });

  const onReset = () => {
    if (company?.id) {
      form.setFieldsValue(company);
    } else {
      form.resetFields();
    }
    onCancel();
  };

  const onFinish = (values: any) => {
    updateCompany(values);
  };

  useEffect(() => {
    if (company?.id) {
      form.setFieldsValue(company);
    }
  }, [company]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="district"
        label={CompanyKeys.district}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.district}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.district}`} />
      </Form.Item>

      <Form.Item
        name="address"
        label={CompanyKeys.address}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.address}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.address}`} />
      </Form.Item>

      <Form.Item
        name="phone"
        label={CompanyKeys.phone}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.phone}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.phone}`} />
      </Form.Item>

      <Form.Item
        name="fax"
        label={CompanyKeys.fax}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.fax}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.fax}`} />
      </Form.Item>

      <Form.Item
        name="postcode"
        label={CompanyKeys.postcode}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.postcode}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.postcode}`} />
      </Form.Item>

      <div style={{ height: 24 }} />

      <div className={styles.footer}>
        <Button style={{ marginRight: 12 }} onClick={onReset}>
          取消
        </Button>
        <Button type="primary" loading={loading} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditContactForm;
