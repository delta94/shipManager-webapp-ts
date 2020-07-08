import { Button, Card, Radio, Form, Input, message, Select } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addSailor, listSailorPosition } from '@/services/sailor';
import { useRequest } from '@umijs/hooks';
import FileUpload from '@/components/FileUpload';
import { OSSResourceType, parseOSSFile } from '@/utils/OSSClient';
import { routerRedux, useDispatch } from 'dva';
import { listShipMeta } from '@/services/ship';
import ISailor from '@/interfaces/ISailor';

const SailorCreate: React.FC<any> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data: sailorPositions } = useRequest(listSailorPosition, {
    cacheKey: 'sailor_positions',
    initialData: [],
  });

  const { loading, run: createSailor } = useRequest(addSailor, {
    manual: true,
    onSuccess: () => {
      message.success('船员信息已录入');
      dispatch(routerRedux.push('/person/sailor/list'));
    },
    onError: error => {
      console.error(error);
      message.error('船员信息录入失败');
    },
  });

  const { data: shipMetaList } = useRequest(listShipMeta, {
    manual: false,
  });

  const onFinish = (values: Partial<ISailor>) => {
    //@ts-ignore
    values.certFile = parseOSSFile(values.certFile);
    createSailor(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeaderWrapper title="新建船员信息" content="按表单提示填入相应信息">
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} hideRequiredMark>
          <Form.Item
            name="name"
            label="船员姓名"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="identityNumber"
            label="身份证号码"
            rules={[
              {
                required: true,
                message: '请输入船员身份证号码',
              },
            ]}
          >
            <Input placeholder="请输入船员身份证号码" />
          </Form.Item>

          <Form.Item
            name="positionId"
            label="常任职位"
            rules={[
              {
                required: true,
                message: '请输入职位',
              },
            ]}
          >
            <Select placeholder="请选择职位">
              {sailorPositions?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="shipId"
            label="所属船舶"
            rules={[
              {
                required: true,
                message: '请选择所属船舶',
              },
            ]}
          >
            <Select placeholder="请选择所属船舶">
              {shipMetaList?.map(item => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="手机号码"
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机',
              },
            ]}
          >
            <Input placeholder="请输入手机" />
          </Form.Item>

          <Form.Item label="是否为高级船员" name="isAdvanced">
            <Radio.Group>
              <Radio value={true} defaultChecked>
                是
              </Radio>
              <Radio value={false}>不是</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="证书电子件" name="certFile">
            <FileUpload listType="picture" resourceType={OSSResourceType.SailorCert} />
          </Form.Item>

          <Form.Item
            label="家庭地址"
            name="address"
            rules={[
              {
                required: true,
                message: '请输入家庭地址',
              },
            ]}
          >
            <Input.TextArea style={{ minHeight: 32 }} placeholder="请输入联系地址" rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
              保存
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorCreate;
