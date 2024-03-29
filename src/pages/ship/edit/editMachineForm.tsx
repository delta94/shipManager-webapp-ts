import React, { useEffect } from 'react';
import { InputNumber, Input, Form, message, Button, Select } from 'antd';
import { IShipMachine } from '@/interfaces/IShip';
import { ShipMachineKeyMap, upsertShipMachine } from '@/services/shipService';
import { useRequest } from 'umi';
import { ICommonOptionType } from '@/interfaces/ICategory';

interface EditMachineFormProps {
  machine?: Partial<IShipMachine>;
  machineTypes?: ICommonOptionType[];
  onUpdate: Function;
  onCancel: Function;
  runSave?: boolean;
}

const EditMachineForm: React.FC<EditMachineFormProps> = ({
  machine,
  machineTypes,
  onUpdate,
  onCancel,
  runSave = true,
}) => {
  const [form] = Form.useForm();

  const { loading, run: updateShipInfo } = useRequest(upsertShipMachine, {
    manual: true,
    onSuccess() {
      message.success('船机信息已更新');
      onUpdate();
    },
    onError() {
      message.error('船机信息更新失败');
    },
  });

  const onReset = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values: Partial<IShipMachine>) => {
    if (values.shipMachineTypeId) {
      // @ts-ignore
      values.shipMachineTypeName = machineTypes.filter((item) => item.id == values.shipMachineTypeId)[0].name;
    }
    if (runSave) {
      updateShipInfo(values);
    } else {
      onUpdate(values);
    }
  };

  useEffect(() => {
    if (machine) {
      form.setFieldsValue(machine);
    }
  }, [machine]);

  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 6, offset: 1 }} wrapperCol={{ span: 12 }}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item label="shipId" name="shipId" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Form.Item
        name="manufacturer"
        label={ShipMachineKeyMap.manufacturer}
        rules={[
          {
            required: true,
            message: `请输入${ShipMachineKeyMap.manufacturer}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ShipMachineKeyMap.manufacturer}`} />
      </Form.Item>

      <Form.Item
        name="shipMachineTypeId"
        label={ShipMachineKeyMap.shipMachineTypeName}
        rules={[
          {
            required: true,
            message: `请输入${ShipMachineKeyMap.shipMachineTypeName}`,
          },
        ]}
      >
        <Select placeholder={`请选择${ShipMachineKeyMap.shipMachineTypeName}`}>
          {machineTypes &&
            machineTypes.map((val) => (
              <Select.Option value={val.id} key={val.id}>
                {val.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="model"
        label={ShipMachineKeyMap.model}
        rules={[
          {
            required: true,
            message: `请输入${ShipMachineKeyMap.model}`,
          },
        ]}
      >
        <Input placeholder={`请输入${ShipMachineKeyMap.model}`} />
      </Form.Item>

      <Form.Item
        name="power"
        label={ShipMachineKeyMap.power}
        rules={[
          {
            required: true,
            message: `请输入${ShipMachineKeyMap.power}`,
          },
        ]}
      >
        <InputNumber placeholder={`请输入${ShipMachineKeyMap.power}`} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="remark"
        label={ShipMachineKeyMap.remark}
        rules={[
          {
            required: false,
            message: `请输入${ShipMachineKeyMap.remark}`,
          },
        ]}
      >
        <Input.TextArea placeholder={`请输入${ShipMachineKeyMap.remark}`} rows={3} />
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

export default EditMachineForm;
