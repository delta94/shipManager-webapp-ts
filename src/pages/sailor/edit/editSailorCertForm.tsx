import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { ISailorCert, ISailorCertType } from '@/interfaces/ISailor';
import { SailorCertKeyMap } from '@/services/sailorCertService';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { dateFormatter, dateFormatterToString } from '@/utils/parser';

interface EditSailorCertFormProps {
  certificate?: ISailorCert;
  issueDepartmentType?: IssueDepartmentType[];
  certificateType?: ISailorCertType[];
  onCancel: Function;
  onSubmit: Function;
}

const EditSailorCertForm: React.FC<EditSailorCertFormProps> = ({
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
    values.sailorCertTypeName = certificateType!.find(item => item.id == values.sailorCertTypeId)?.name;
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
        label={SailorCertKeyMap.name}
        rules={[
          {
            required: true,
            message: `请输入${SailorCertKeyMap.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入${SailorCertKeyMap.name}`} />
      </Form.Item>

      <Form.Item
        name="identityNumber"
        label={SailorCertKeyMap.identityNumber}
        rules={[
          {
            required: true,
            message: `请输入${SailorCertKeyMap.identityNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入${SailorCertKeyMap.identityNumber}`} />
      </Form.Item>

      <Form.Item
        name="sailorCertTypeId"
        label={SailorCertKeyMap.sailorCertTypeName}
        rules={[
          {
            required: true,
            message: `请选择${SailorCertKeyMap.sailorCertTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${SailorCertKeyMap.sailorCertTypeName}`}>
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
        label={SailorCertKeyMap.issueDepartmentTypeName}
        rules={[
          {
            required: true,
            message: `请选择${SailorCertKeyMap.issueDepartmentTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${SailorCertKeyMap.issueDepartmentTypeName}`}>
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
        label={SailorCertKeyMap.expiredAt}
        rules={[
          {
            required: true,
            message: `请输入${SailorCertKeyMap.expiredAt}`,
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
        label={SailorCertKeyMap.issuedAt}
        rules={[
          {
            required: true,
            message: `请输入${SailorCertKeyMap.issuedAt}`,
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

      <Form.Item name="ossFiles" label={SailorCertKeyMap.ossFiles}>
        <AliyunOSSUpload listType="picture" />
      </Form.Item>

      <Form.Item
        name="remark"
        label={SailorCertKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入${SailorCertKeyMap.remark}`,
          },
        ]}
      >
        <Input placeholder={`请输入${SailorCertKeyMap.remark}`} />
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

export default EditSailorCertForm;
