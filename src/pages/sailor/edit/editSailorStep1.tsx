import React, { useEffect, useCallback } from 'react';
import { Button, Form, Input, Select, Radio, DatePicker, Row, Col } from 'antd';
import { ISailor, ISailorDutyType } from '@/interfaces/ISailor';
import { SailorKeyMap } from '@/services/sailorService';
import { dateFormatter } from '@/utils/parser';
import { IShip } from '@/interfaces/IShip';

interface EditSailorStep1Props {
  sailor?: ISailor;
  shipMeta?: IShip[];
  dutyTypes?: ISailorDutyType[];
  onNext(sailor: Partial<ISailor>): void;
}

const EditSailorStep1: React.FC<EditSailorStep1Props> = ({ sailor, dutyTypes, shipMeta, onNext }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (sailor) {
      let values = dateFormatter({ ...sailor });
      form.setFieldsValue(values);
    }
  }, [sailor]);

  const onFinish = useCallback(
    values => {
      values.sailorDutyName = dutyTypes!.find(item => item.id == values.sailorDutyId)?.name;
      onNext({
        ...sailor,
        ...values,
      });
    },
    [sailor],
  );

  return (
    <Form form={form} onFinish={onFinish} layout={'vertical'}>
      <Form.Item label="id" name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Row gutter={12}>
        <Col span={8}>
          <Form.Item
            name="name"
            label={SailorKeyMap.name}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.name}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.name}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="shipId"
            label={SailorKeyMap.shipName}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.shipName}`,
              },
            ]}
          >
            <Select placeholder={`请选择${SailorKeyMap.shipName}`}>
              {shipMeta?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <span />
        </Col>

        <Col span={8}>
          <Form.Item
            name="isAdvanced"
            label={SailorKeyMap.isAdvanced}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.isAdvanced}`,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="gender"
            label={SailorKeyMap.gender}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.gender}`,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={0}>男性</Radio>
              <Radio value={1}>女性</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="birthDate"
            label={SailorKeyMap.birthDate}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.birthDate}`,
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
        </Col>

        <Col span={8}>
          <Form.Item
            name="contractWorkAt"
            label={SailorKeyMap.contractWorkAt}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.contractWorkAt}`,
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
        </Col>

        <Col span={8}>
          <Form.Item
            name="contractExpiryAt"
            label={SailorKeyMap.contractExpiryAt}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.contractExpiryAt}`,
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
        </Col>

        <Col span={8}>
          <Form.Item
            name="mobile"
            label={SailorKeyMap.mobile}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.mobile}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.mobile}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="identityNumber"
            label={SailorKeyMap.identityNumber}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.identityNumber}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.identityNumber}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="licenseNumber"
            label={SailorKeyMap.licenseNumber}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.licenseNumber}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.licenseNumber}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="sailorDutyTypeId"
            label={SailorKeyMap.sailorDutyTypeName}
            rules={[
              {
                required: true,
                message: `请输入${SailorKeyMap.sailorDutyTypeName}`,
              },
            ]}
          >
            <Select placeholder={`请选择${SailorKeyMap.sailorDutyTypeName}`}>
              {dutyTypes?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="region"
            label={SailorKeyMap.region}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.region}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.region}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="address"
            label={SailorKeyMap.address}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.address}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.address}`} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="remark"
            label={SailorKeyMap.remark}
            rules={[
              {
                required: false,
                message: `请输入${SailorKeyMap.remark}`,
              },
            ]}
          >
            <Input placeholder={`请输入${SailorKeyMap.remark}`} />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ height: 24 }} />

      <div className="g-ant-modal-footer">
        <Button type="primary" htmlType="submit">
          下一步
        </Button>
      </div>
    </Form>
  );
};

export default EditSailorStep1;
