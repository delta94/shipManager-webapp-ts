import {Button, Card, DatePicker, Form, Input, message} from 'antd';
import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {infoCompanyLicense, updateCompanyLicense} from '@/services/company';
import {useRequest} from '@umijs/hooks';
import FileUpload from '@/components/FileUpload';
import {ICompanyLicense} from '@/interfaces/ICompany';
import OSSClient, {OSSResourceType, parseOSSFile, parseUploadData} from '@/utils/OSSClient';
import {routerRedux, useDispatch} from 'dva';
import {RouteComponentProps} from 'react-router';
import moment from 'moment';

const CompanyLicenseUpdate: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: { params },
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useRequest(() => infoCompanyLicense(parseInt(params.id)), {
    cacheKey: `company_license_${params.id}`,
    onSuccess: async result => {
      let client = await OSSClient.getInstance();
      let values = Object.keys(result).reduce(function(prev, key) {
        if (key == 'expireAt' && result[key]) {
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

  const { loading, run } = useRequest(updateCompanyLicense, {
    manual: true,
    onSuccess: () => {
      message.success('公司批文信息已更新');
      dispatch(routerRedux.push('/company/listLicense'));
    },
    onError: error => {
      console.error(error);
      message.error('公司批文信息更新失败');
    },
  });

  const onFinish = (values: Partial<ICompanyLicense>) => {
    //@ts-ignore
    values.expireAt = values.expireAt.format('YYYY-MM-DD');
    //@ts-ignore
    values.ossFile = parseOSSFile(values.ossFile);
    values.id = parseInt(params.id);
    run(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeaderWrapper title="公司批文信息" content="按表单提示填入相应信息">
      <Card title="更新批文信息" bordered={false}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          hideRequiredMark
        >
          <Form.Item
            name="name"
            label="批文名"
            rules={[
              {
                required: true,
                message: '请输入批文名',
              },
            ]}
          >
            <Input placeholder="请输入批文名" />
          </Form.Item>

          <Form.Item
            name="identityNumber"
            label="批文编号"
            rules={[
              {
                required: true,
                message: '请输入批文编号',
              },
            ]}
          >
            <Input placeholder="请输入批文编号" />
          </Form.Item>

          <Form.Item
            label="批文过期日期"
            name="expireAt"
            rules={[{ required: true, type: 'object', message: '请输入批文过期日期' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              placeholder="请选择批文过期日期"
            />
          </Form.Item>

          <Form.Item label="批文电子件" name="ossFile">
            <FileUpload listType="picture" resourceType={OSSResourceType.CompanyLicense}/>
          </Form.Item>

          <Form.Item label="批文备注" name="remark">
            <Input.TextArea placeholder="请输入批文备注" />
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

export default CompanyLicenseUpdate;
