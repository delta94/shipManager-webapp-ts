import { Form, Input, Card, DatePicker, Select, Button, message } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addCompanyCert, listCompanyCertType } from '@/services/company';
import { useRequest } from '@umijs/hooks';
import FileUpload from '@/components/FileUpload';
import { ICompanyCert } from '@/interfaces/ICompany';
import { parseOSSFile } from '@/utils/OSSClient';
import { useDispatch, routerRedux } from 'dva';

const CompanyCertCreate: React.FC<any> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data: certificateTypes } = useRequest(() => listCompanyCertType(), {
    cacheKey: 'company_cert_type',
    initialData: [],
  });

  const { loading, run } = useRequest(addCompanyCert, {
    manual: true,
    onSuccess: () => {
      message.success('公司证书信息已录入');
      dispatch(routerRedux.push('/company/listCert'));
    },
    onError: error => {
      console.error(error);
      message.error('公司证书信息已录入失败');
    },
  });

  const onFinish = (values: Partial<ICompanyCert>) => {
    //@ts-ignore
    values.expiredAt = values.expiredAt.format('YYYY-MM-DD');
    //@ts-ignore
    values.ossFile = parseOSSFile(values.ossFile);

    run(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeaderWrapper title="新的公司证书信息" content="按表单提示填入相应信息">
      <Card title="证书信息" bordered={false}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hideRequiredMark
        >
          <Form.Item
            name="name"
            label="证书名"
            rules={[
              {
                required: true,
                message: '请输入证书名',
              },
            ]}
          >
            <Input placeholder="请输入证书名" />
          </Form.Item>

          <Form.Item
            name="identityNumber"
            label="证书编号"
            rules={[
              {
                required: true,
                message: '请输入证书编号',
              },
            ]}
          >
            <Input placeholder="请输入证书编号" />
          </Form.Item>

          <Form.Item
            name="typeId"
            label="证书类型"
            rules={[
              {
                required: true,
                message: '请输入证书类型',
              },
            ]}
          >
            <Select placeholder="请选择证书类型">
              {certificateTypes &&
                certificateTypes.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="证书过期日期"
            name="expiredAt"
            rules={[{ required: true, type: 'object', message: '请输入证书过期日期' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              placeholder="请选择证书过期日期"
            />
          </Form.Item>

          <Form.Item label="证书电子件" name="ossFile">
            <FileUpload listType="picture" />
          </Form.Item>

          <Form.Item label="证书备注" name="remark">
            <Input.TextArea placeholder="请输入证书备注" />
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

export default CompanyCertCreate;
