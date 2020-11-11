import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { IManagerCert } from '@/interfaces/IManager';
import { ManagerCertKeyMap } from '@/services/managerCertService';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { dateFormatter, dateFormatterToString } from '@/utils/parser';
import CategorySelect from '@/components/CategorySelect';

interface EditManagerCertFormProps {
  certificate?: IManagerCert;
  onCancel: Function;
  onSubmit: Function;
}

const EditManagerCertForm: React.FC<EditManagerCertFormProps> = ({ certificate, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const onFormFinish = (values: any) => {
    values = dateFormatterToString(values);

    if (!values.id) {
      values.id = `new_${Date.now()}`;
    }
    onSubmit(values);
  };

  const onFormCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (certificate) {
      let values = dateFormatter({ ...certificate });
      form.setFieldsValue({
        ...values,
      });
    }
  }, [certificate]);

  return (
    <Form form={form} onFinish={onFormFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item label="issueDepartmentTypeName" name="issueDepartmentTypeName" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item label="managerCertTypeName" name="managerCertTypeName" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={ManagerCertKeyMap.name}
        rules={[
          {
            required: true,
            message: `请输入${ManagerCertKeyMap.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerCertKeyMap.name}`} />
      </Form.Item>

      <Form.Item
        name="identityNumber"
        label={ManagerCertKeyMap.identityNumber}
        rules={[
          {
            required: true,
            message: `请输入${ManagerCertKeyMap.identityNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerCertKeyMap.identityNumber}`} />
      </Form.Item>

      <Form.Item
        name="managerCertTypeId"
        label={ManagerCertKeyMap.managerCertTypeName}
        rules={[
          {
            required: true,
            message: `请选择${ManagerCertKeyMap.managerCertTypeName}`,
          },
        ]}
      >
        <CategorySelect
          form={form}
          linkTypeNameField="managerCertTypeName"
          showNotChoose={false}
          category={'ManagerCertType'}
          placeholder={`请选择${ManagerCertKeyMap.managerCertTypeName}`}
        />
      </Form.Item>

      <Form.Item
        name="issueDepartmentTypeId"
        label={ManagerCertKeyMap.issueDepartmentTypeName}
        rules={[
          {
            required: true,
            message: `请选择${ManagerCertKeyMap.issueDepartmentTypeName}`,
          },
        ]}
      >
        <CategorySelect
          form={form}
          linkTypeNameField="issueDepartmentTypeName"
          showNotChoose={false}
          category={'IssueDepartmentType'}
          placeholder={`请选择${ManagerCertKeyMap.issueDepartmentTypeName}`}
        />
      </Form.Item>

      <Form.Item
        name="expiredAt"
        label={ManagerCertKeyMap.expiredAt}
        rules={[
          {
            required: true,
            message: `请输入${ManagerCertKeyMap.expiredAt}`,
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="issuedAt"
        label={ManagerCertKeyMap.issuedAt}
        rules={[
          {
            required: true,
            message: `请输入${ManagerCertKeyMap.issuedAt}`,
          },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item name="ossFiles" label={ManagerCertKeyMap.ossFiles}>
        <AliyunOSSUpload listType="picture" />
      </Form.Item>

      <Form.Item
        name="remark"
        label={ManagerCertKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入${ManagerCertKeyMap.remark}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ManagerCertKeyMap.remark}`} />
      </Form.Item>

      <div style={{ height: 40 }} />
      <div className="g-ant-modal-footer">
        <Button onClick={onFormCancel} style={{ marginRight: 12 }}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default EditManagerCertForm;
