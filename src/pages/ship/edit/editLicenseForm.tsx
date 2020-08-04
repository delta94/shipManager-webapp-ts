import React, { useEffect } from 'react';
import { ShipLicenseKeyMap, upsertShipLicense } from '@/services/shipService';
import { message, Form, DatePicker, Input, Button, Select } from 'antd';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { IShipLicense, IShipLicenseType } from '@/interfaces/IShip';
import { useRequest } from '@umijs/hooks';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import { dateFormatter, dateFormatterToString, formatUploadFileToOSSFiles } from '@/utils/parser';

interface EditPayloadFormProps {
  license?: Partial<IShipLicense>;
  onUpdate: Function;
  onCancel: Function;
  shipLicenseType: IShipLicenseType[];
  issueDepartmentType: IssueDepartmentType[];
  runSave?: boolean;
}

const EditLicenseForm: React.FC<EditPayloadFormProps> = ({
  onCancel,
  onUpdate,
  license,
  shipLicenseType,
  issueDepartmentType,
  runSave = true,
}) => {
  const [form] = Form.useForm();

  const { loading, run: updateShipLicenseInfo } = useRequest(upsertShipLicense, {
    manual: true,
    onSuccess() {
      message.success('营运证已更新');
      onUpdate();
    },
    onError() {
      message.error('营运证更新失败');
    },
  });

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: any) => {
    let license = formatUploadFileToOSSFiles(values) as IShipLicense;
    license = dateFormatterToString(license);
    if (runSave) {
      updateShipLicenseInfo(license);
    } else {
      onUpdate(license);
    }
  };

  useEffect(() => {
    if (license) {
      let values = dateFormatter({ ...license });
      form.setFieldsValue(values);
    }
  }, [license]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6, offset: 1 }} wrapperCol={{ span: 10 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item label="shipId" name="shipId" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="name"
        label={ShipLicenseKeyMap.name}
        rules={[
          {
            required: true,
            message: `请输入${ShipLicenseKeyMap.name}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ShipLicenseKeyMap.name}`} />
      </Form.Item>

      <Form.Item
        name="identityNumber"
        label={ShipLicenseKeyMap.identityNumber}
        rules={[
          {
            required: true,
            message: `请输入${ShipLicenseKeyMap.identityNumber}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ShipLicenseKeyMap.identityNumber}`} />
      </Form.Item>

      <Form.Item
        name="businessField"
        label={ShipLicenseKeyMap.businessField}
        rules={[
          {
            required: true,
            message: `请输入${ShipLicenseKeyMap.businessField}`,
          },
        ]}
      >
        <Input.TextArea rows={2} placeholder={`请输入${ShipLicenseKeyMap.businessField}`} />
      </Form.Item>

      <Form.Item
        name="shipLicenseTypeId"
        label={ShipLicenseKeyMap.shipLicenseTypeName}
        rules={[
          {
            required: true,
            message: `请选择${ShipLicenseKeyMap.shipLicenseTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ShipLicenseKeyMap.shipLicenseTypeName}`}>
          {shipLicenseType?.map(item => {
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
        label={ShipLicenseKeyMap.issueDepartmentTypeName}
        rules={[
          {
            required: true,
            message: `请选择${ShipLicenseKeyMap.issueDepartmentTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ShipLicenseKeyMap.issueDepartmentTypeName}`}>
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
        label={ShipLicenseKeyMap.expiredAt}
        rules={[
          {
            required: true,
            message: `请输入${ShipLicenseKeyMap.expiredAt}`,
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
        label={ShipLicenseKeyMap.issuedAt}
        rules={[
          {
            required: true,
            message: `请输入${ShipLicenseKeyMap.issuedAt}`,
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

      <Form.Item name="ossFiles" label={ShipLicenseKeyMap.ossFiles}>
        <AliyunOSSUpload listType="picture" />
      </Form.Item>

      <Form.Item
        name="remark"
        label={ShipLicenseKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入${ShipLicenseKeyMap.remark}`,
          },
        ]}
      >
        <Input.TextArea rows={2} placeholder={`请输入${ShipLicenseKeyMap.remark}`} />
      </Form.Item>

      <div style={{ height: 24 }} />

      <div className="g-ant-modal-footer">
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

export default EditLicenseForm;
