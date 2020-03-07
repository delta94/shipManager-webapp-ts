import { Button, Card, Form, Input, message, Select } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/hooks';
import FileUpload from '@/components/FileUpload';
import { OSSResourceType, parseOSSFile } from '@/utils/OSSClient';
import { routerRedux, useDispatch, useSelector } from 'dva';
import { RouteComponentProps } from 'react-router-dom';
import { addCompanySheet, listCompanySheetTypes } from '@/services/sheet';
import { ICompanySheet } from '@/interfaces/ICompanySheet';
import moment from 'moment';
import { ConnectState } from '@/models/connect';

const CompanySheetCreate: React.FC<RouteComponentProps<{ type: string }>> = ({
  match: { params },
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data: companySheetType } = useRequest(() => listCompanySheetTypes(), {
    cacheKey: 'company_cert_type',
    initialData: [],
  });

  const currentUser = useSelector((s: ConnectState) => s.user.currentUser!);

  const { loading, run } = useRequest(addCompanySheet, {
    manual: true,
    onSuccess: () => {
      message.success('模版信息已录入');

      dispatch(
        routerRedux.push(
          params.type == 'template' ? '/document/template/list' : '/document/common/list',
        ),
      );
    },
    onError: error => {
      console.error(error);
      message.error('模版信息录入失败');
    },
  });

  const onFinish = (values: Partial<ICompanySheet>) => {
    values.isTemplate = params.type == 'template';
    //@ts-ignore
    values.updateAt = moment().format('YYYY-MM-DD');
    values.uploader = currentUser.login;
    //@ts-ignore
    values.fileSize = values.ossFile[0].size;
    //@ts-ignore
    values.ossFile = parseOSSFile(values.ossFile);

    run(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeaderWrapper title="新建模版" content="按表单提示填入相应信息">
      <Card title="模版信息" bordered={false}>
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
            <Select placeholder="请选择类型">
              {companySheetType &&
                companySheetType.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="模版电子件"
            name="ossFile"
            rules={[
              {
                required: true,
                message: '请上传模版文件',
              },
            ]}
          >
            <FileUpload listType="picture" limit={1} resourceType={OSSResourceType.CompanySheet} />
          </Form.Item>

          {params.type == 'template' && (
            <Form.Item
              name="bindings"
              label="变量信息"
              rules={[
                {
                  required: false,
                  message: '请输入变量信息',
                },
              ]}
            >
              <Input.TextArea placeholder="请输入模版变量信息" />
            </Form.Item>
          )}

          <Form.Item label="备注" name="remark">
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

export default CompanySheetCreate;
