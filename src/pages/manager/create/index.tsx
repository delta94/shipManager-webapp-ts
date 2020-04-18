import React, { useState, useRef } from 'react';
import { OSSResourceType, parseOSSFile } from '@/utils/OSSClient';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, message, Radio } from 'antd';
import ISailor from '@/interfaces/ISailor';
import { useDispatch, routerRedux } from 'dva';
import { addSailor } from '@/services/sailor';
import { useRequest } from '@umijs/hooks';
import { listManagerAssignerPosition } from '@/services/manager';
import { IManagerCert } from '@/interfaces/IManager';
import { findDOMNode } from 'react-dom';
import ManagerCertList from '../components/ManagerCertList';

const MangerCreate: React.FC = () => {
  const [form] = Form.useForm();
  const addBtn = useRef(null);
  const dispatch = useDispatch();
  const { loading, run: createSailor } = useRequest(addSailor, {
    manual: true,
    onSuccess: () => {
      message.success('管理员信息已录入');
      dispatch(routerRedux.push('/person/manager/list'));
    },
    onError: error => {
      console.error(error);
      message.error('船员信息录入失败');
    },
  });

  const { data: assignerPositions } = useRequest(listManagerAssignerPosition, {
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

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<IManagerCert> | undefined>(undefined);

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  return (
    <PageHeaderWrapper title="新管理人员信息" content="按表单提示填入相应信息">
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        hideRequiredMark
      >
        <Card bordered={false} title="基本信息">
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入管理人员姓名',
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
                message: '请输入管理人员身份证号码',
              },
            ]}
          >
            <Input placeholder="请输入管理人员身份证号码" />
          </Form.Item>

          <Form.Item
            name="assignerId"
            label="指定职位"
            rules={[
              {
                required: true,
                message: '请输入指定职位',
              },
            ]}
          >
            <Select placeholder="请选择职位">
              {assignerPositions?.map((item, index) => (
                <Select.Option value={item.id} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="部门"
            name="dept"
            rules={[
              {
                required: true,
                message: '请输入部门',
              },
            ]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>

          <Form.Item
            label="职务"
            name="position"
            rules={[
              {
                required: true,
                message: '请输入职务',
              },
            ]}
          >
            <Input placeholder="请输入座机电话" />
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

          <Form.Item
            label="座机电话"
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入座机电话',
              },
            ]}
          >
            <Input placeholder="请输入座机电话" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }} loading={loading}>
              保存
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Card>

        <Card bordered={false} title="资格证书">
          <Form.Item name="certs" wrapperCol={{ span: 20 }}>
            <ManagerCertList />
          </Form.Item>
        </Card>
      </Form>
    </PageHeaderWrapper>
  );
};

export default MangerCreate;
