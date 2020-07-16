import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { IManagerCert, IManagerCertType } from '@/interfaces/IManager';
import { ManagerCertKeyMap } from '@/services/managerCertService';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { dateFormatter, dateFormatterToString } from '@/utils/parser';

interface EditManagerCertFormProps {
  certificate?: IManagerCert;
  issueDepartmentType?: IssueDepartmentType[];
  certificateType?: IManagerCertType[];
  onCancel: Function;
  onSubmit: Function;
}

const EditManagerCertForm: React.FC<EditManagerCertFormProps> = ({
  certificate,
  certificateType = [],
  issueDepartmentType = [],
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const onFormFinish = (values: any) => {
    values = dateFormatterToString(values);

    if (!values.id) {
      values.id = `new_${Date.now()}`;
    }
    values.managerCertTypeName = certificateType!.find(item => item.id == values.managerCertTypeId)?.name;
    values.issueDepartmentTypeName = issueDepartmentType!.find(item => item.id == values.issueDepartmentTypeId)?.name;
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
    <Form form={form} name="form" onFinish={onFormFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={ManagerCertKeyMap.name}
        rules={[
          {
            required: false, // ta
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
            required: false, // ta
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
            required: false, // ta
            message: `请选择${ManagerCertKeyMap.managerCertTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ManagerCertKeyMap.managerCertTypeName}`}>
          {certificateType?.map(item => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="issueDepartmentTypeId"
        label={ManagerCertKeyMap.issueDepartmentTypeName}
        rules={[
          {
            required: false, // ta
            message: `请选择${ManagerCertKeyMap.issueDepartmentTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ManagerCertKeyMap.issueDepartmentTypeName}`}>
          {issueDepartmentType?.map(item => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="expiredAt"
        label={ManagerCertKeyMap.expiredAt}
        rules={[
          {
            required: false, // ta
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
            required: false, // ta
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
            required: false, // ta
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
