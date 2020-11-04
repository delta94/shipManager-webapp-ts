import React, { useEffect } from 'react';
import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import { useRequest } from 'umi';
import styles from './style.less';
import {
  CompanyCertKeyMap as CompanyCertKey,
  createCompanyCert,
  updateCompanyCert,
} from '@/services/companyCertService';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { ICompanyCert } from '@/interfaces/ICompany';
import { dateFormatter, formatUploadFileToOSSFiles } from '@/utils/parser';
import { listCompanyCategoryType } from '@/services/companyService';

interface EditCertificateFormProps {
  certificate?: ICompanyCert;
  onUpdate: Function;
  onCancel: Function;
}

const EditCertificateForm: React.FC<EditCertificateFormProps> = ({ certificate, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  const { loading, run: addCert } = useRequest(createCompanyCert, {
    manual: true,
    onSuccess() {
      message.success('企业证书已更新');
      onUpdate();
    },
    onError() {
      message.error('企业证书更新失败');
    },
  });

  const { loading: updating, run: updateCert } = useRequest(updateCompanyCert, {
    manual: true,
    onSuccess() {
      message.success('企业证书已更新');
      onUpdate();
    },
    onError() {
      message.error('企业证书更新失败');
    },
  });

  const { data: companyCategoryType } = useRequest(listCompanyCategoryType, {
    manual: false,
    cacheKey: 'company_category_type',
  });

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: any) => {
    let certificate = formatUploadFileToOSSFiles(values, 'Company') as ICompanyCert;
    if (values.id) {
      updateCert(certificate);
    } else {
      addCert(certificate);
    }
  };

  useEffect(() => {
    if (certificate?.id) {
      form.setFieldsValue(dateFormatter(certificate));
    } else {
      form.resetFields();
    }
  }, [certificate]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 12,
      }}
    >
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={CompanyCertKey.name}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入${CompanyCertKey.name}`} />
      </Form.Item>

      <Form.Item
        name="identityNumber"
        label={CompanyCertKey.identityNumber}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.identityNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入${CompanyCertKey.identityNumber}`} />
      </Form.Item>

      <Form.Item
        name="companyCertTypeId"
        label={CompanyCertKey.companyCertTypeName}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.companyCertTypeName}`,
          },
        ]}
      >
        <Select placeholder="请选择证书类型">
          {companyCategoryType &&
            companyCategoryType.CompanyCertType.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="issueDepartmentTypeId"
        label={CompanyCertKey.issueDepartmentTypeName}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.issueDepartmentTypeName}`,
          },
        ]}
      >
        <Select placeholder="请选择颁发机构">
          {companyCategoryType &&
            companyCategoryType.IssueDepartmentType.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="expiredAt"
        label={CompanyCertKey.expiredAt}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.expiredAt}`,
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{
            width: '100%',
          }}
          placeholder={`请输入${CompanyCertKey.expiredAt}`}
        />
      </Form.Item>

      <Form.Item
        name="issuedAt"
        label={CompanyCertKey.issuedAt}
        rules={[
          {
            required: true,
            message: `请输入${CompanyCertKey.issuedAt}`,
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{
            width: '100%',
          }}
          placeholder={`请输入${CompanyCertKey.issuedAt}`}
        />
      </Form.Item>

      <Form.Item name="ossFiles" label={CompanyCertKey.ossFiles}>
        <AliyunOSSUpload listType="picture" />
      </Form.Item>

      <Form.Item
        name="remark"
        label={CompanyCertKey.remark}
        rules={[
          {
            required: false,
            message: `请输入${CompanyCertKey.remark}`,
          },
        ]}
      >
        <Input.TextArea placeholder={`请输入${CompanyCertKey.remark}`} />
      </Form.Item>

      <div
        style={{
          height: 24,
        }}
      />

      <div className={styles.footer}>
        <Button
          style={{
            marginRight: 12,
          }}
          onClick={onReset}
        >
          取消
        </Button>
        <Button type="primary" loading={loading || updating} htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditCertificateForm;
