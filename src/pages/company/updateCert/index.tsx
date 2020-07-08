import { Button, Card, DatePicker, Form, Input, message, Select } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { infoCompanyCert, listCompanyCertType, updateCompanyCert } from '@/services/company';
import { useRequest } from '@umijs/hooks';
import FileUpload from '@/components/FileUpload';
import { ICompanyCert } from '@/interfaces/ICompany';
import OSSClient, { OSSResourceType, parseOSSFile, parseUploadData } from '@/utils/OSSClient';
import { routerRedux, useDispatch } from 'dva';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';

const CompanyCertUpdate: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useRequest(() => infoCompanyCert(parseInt(params.id)), {
    cacheKey: `company_cert_${params.id}`,
    onSuccess: async result => {
      let client = await OSSClient.getInstance();
      let values = Object.keys(result).reduce(function(prev, key) {
        if (key == 'expiredAt') {
          // @ts-ignore
          prev.push({ name: key, value: moment(result[key]) });
        } else if (key == 'ossFile') {
          // @ts-ignore
          prev.push({ name: key, value: parseUploadData(result[key], client) });
        } else {
          // @ts-ignore
          prev.push({ name: key, value: result[key] });
        }
        return prev;
      }, []);

      form.setFields(values);
    },
    refreshDeps: [params.id],
  });

  const { data: certificateTypes } = useRequest(() => listCompanyCertType(), {
    cacheKey: 'company_cert_type',
    initialData: [],
  });

  const { loading, run } = useRequest(updateCompanyCert, {
    manual: true,
    onSuccess: () => {
      message.success('公司证书信息已更新');
      dispatch(routerRedux.push('/company/listCert'));
    },
    onError: error => {
      console.error(error);
      message.error('公司证书信息更新失败');
    },
  });

  const onFinish = (values: Partial<ICompanyCert>) => {
    //@ts-ignore
    values.expiredAt = values.expiredAt.format('YYYY-MM-DD');
    //@ts-ignore
    values.ossFile = parseOSSFile(values.ossFile);
    values.id = parseInt(params.id);
    run(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeaderWrapper title="公司证书信息" content="按表单提示填入相应信息">
      <Card title="更新证书信息" bordered={false}>
        <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} hideRequiredMark>
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
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请选择证书过期日期" />
          </Form.Item>

          <Form.Item label="证书电子件" name="ossFile">
            <FileUpload listType="picture" resourceType={OSSResourceType.CompanyCert} />
          </Form.Item>

          <Form.Item label="证书备注" name="remark">
            <Input.TextArea placeholder="请输入证书备注" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
              更新
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

export default CompanyCertUpdate;
