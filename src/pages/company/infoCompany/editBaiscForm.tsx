import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { CompanyKeyMap as CompanyKeys, updateCompanyInfo } from '@/services/companyService';
import { useRequest } from 'umi';
import styles from './style.less';
import { ICompany } from '@/interfaces/ICompany';
import { listOptions } from '@/services/globalService';

interface EditBasicFormProps {
  company?: ICompany;
  onUpdate: Function;
  onCancel: Function;
}

const EditBasicForm: React.FC<EditBasicFormProps> = ({ company, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  const { data: companyCategoryType } = useRequest(listOptions, {
    manual: false,
    defaultParams: [['CompanyType', 'CompanyCertType', 'IssueDepartmentType']],
    cacheKey: 'company_category_type'
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
    form.resetFields();
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
          {companyCategoryType &&
            companyCategoryType.CompanyType.map((item, index) => (
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
          取消
        </Button>
        <Button type="primary" loading={loading} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditBasicForm;
