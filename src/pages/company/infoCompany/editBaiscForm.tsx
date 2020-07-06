import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import {
  CompanyKeyMap as CompanyKeys,
  getCompanyType,
  updateCompanyInfo,
} from '@/services/companyService';
import { useRequest } from '@umijs/hooks';
import styles from './style.less';
import { ICompany } from '@/interfaces/ICompany';

const EditBasicForm: React.FC<{ company?: ICompany; onUpdate: Function }> = ({
  company,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  const { data: companyTypes } = useRequest(getCompanyType, {
    cacheKey: 'company_type',
    initialData: [],
  });

  const { loading, run: updateCompany } = useRequest(updateCompanyInfo, {
    manual: true,
    onSuccess() {
      message.success('企业基本信息已更新');
      onUpdate();
    },
    onError() {
      message.error('企业基本信息更新失败');
    },
  });

  const onReset = () => {
    if (company?.id) {
      form.setFieldsValue(company);
    } else {
      form.resetFields();
    }
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
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      hideRequiredMark
    >
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={CompanyKeys.name}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.name}`} />
      </Form.Item>

      <Form.Item
        name="englishName"
        label={CompanyKeys.englishName}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.englishName}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.englishName}`} />
      </Form.Item>

      <Form.Item
        name="companyTypeId"
        label={CompanyKeys.companyTypeName}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.companyTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${CompanyKeys.companyTypeName}`}>
          {companyTypes?.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="businessLicenseNumber"
        label={CompanyKeys.businessLicenseNumber}
        rules={[
          {
            required: true,
            message: `请输入 ${CompanyKeys.businessLicenseNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.businessLicenseNumber}`} />
      </Form.Item>

      <Form.Item
        name="registeredCapital"
        label={CompanyKeys.registeredCapital}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.registeredCapital}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.registeredCapital}`} />
      </Form.Item>

      <Form.Item
        name="businessScope"
        label={CompanyKeys.businessScope}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.businessScope}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.businessScope}`} />
      </Form.Item>

      <Form.Item
        name="legalPerson"
        label={CompanyKeys.legalPerson}
        rules={[
          {
            required: false,
            message: `请输入 ${CompanyKeys.legalPerson}`,
          },
        ]}
      >
        <Input placeholder={`请输入 ${CompanyKeys.legalPerson}`} />
      </Form.Item>

      <div style={{ height: 24 }} />

      <div className={styles.footer}>
        <Button style={{ marginRight: 12 }} onClick={onReset}>
          重置
        </Button>
        <Button type="primary" loading={loading} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditBasicForm;
