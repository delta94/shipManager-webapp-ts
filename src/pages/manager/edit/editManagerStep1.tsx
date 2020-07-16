import React, { useEffect, useCallback } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { IManager, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import { ManagerKeyMap } from '@/services/managerService';

interface EditManagerStep1Props {
  manager?: IManager;
  positionTypes?: IManagerPositionType[];
  dutyTypes?: IManagerDutyType[];
  onNext(manager: Partial<IManager>): void;
}

const EditManagerStep1: React.FC<EditManagerStep1Props> = ({ manager, dutyTypes, positionTypes, onNext }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (manager) {
      form.setFieldsValue(manager);
    }
  }, [manager]);

  const onFinish = useCallback(
    values => {
      values.managerDutyName = dutyTypes!.find(item => item.id == values.managerDutyId)?.name;
      values.managerPositionName = positionTypes!.find(item => item.id == values.managerPositionId)?.name;
      onNext({
        ...manager,
        ...values,
      });
    },
    [manager],
  );

  return (
    <div>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="id" name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="name"
          label={ManagerKeyMap.name}
          rules={[
            {
              required: true,
              message: `请输入${ManagerKeyMap.name}`,
            },
          ]}
        >
          <Input placeholder={`请输入${ManagerKeyMap.name}`} />
        </Form.Item>

        <Form.Item
          name="mobile"
          label={ManagerKeyMap.mobile}
          rules={[
            {
              required: true,
              message: `请输入${ManagerKeyMap.mobile}`,
            },
          ]}
        >
          <Input placeholder={`请输入${ManagerKeyMap.mobile}`} />
        </Form.Item>

        <Form.Item
          name="identityNumber"
          label={ManagerKeyMap.identityNumber}
          rules={[
            {
              required: true,
              message: `请输入${ManagerKeyMap.identityNumber}`,
            },
          ]}
        >
          <Input placeholder={`请输入${ManagerKeyMap.identityNumber}`} />
        </Form.Item>

        <Form.Item
          name="managerDutyId"
          label={ManagerKeyMap.managerDutyName}
          rules={[
            {
              required: true,
              message: `请输入${ManagerKeyMap.managerDutyName}`,
            },
          ]}
        >
          <Select placeholder={`请选择${ManagerKeyMap.managerDutyName}`}>
            {dutyTypes?.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="managerPositionId"
          label={ManagerKeyMap.managerPositionName}
          rules={[
            {
              required: true,
              message: `请输入${ManagerKeyMap.managerPositionName}`,
            },
          ]}
        >
          <Select placeholder={`请选择${ManagerKeyMap.managerPositionName}`}>
            {positionTypes?.map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="educationLevel"
          label={ManagerKeyMap.educationLevel}
          rules={[
            {
              required: false,
              message: `请输入${ManagerKeyMap.educationLevel}`,
            },
          ]}
        >
          <Input placeholder={`请输入${ManagerKeyMap.educationLevel}`} />
        </Form.Item>

        <Form.Item
          name="remark"
          label={ManagerKeyMap.remark}
          rules={[
            {
              required: false,
              message: `请输入${ManagerKeyMap.remark}`,
            },
          ]}
        >
          <Input placeholder={`请输入${ManagerKeyMap.remark}`} />
        </Form.Item>

        <div style={{ height: 24 }} />

        <div className="g-ant-modal-footer">
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditManagerStep1;
