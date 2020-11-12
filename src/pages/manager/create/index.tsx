import React from 'react';
import styles from '@/pages/sailor/create/style.less';
import { createManager, ManagerKeyMap } from '@/services/managerService';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Row, Card, Col, Input, Select, Button, message } from 'antd';
import CategorySelect from '@/components/CategorySelect';
import ManagerCertList from './managerCertList';
import FooterToolbar from '@/components/FooterToolbar';
import { useRequest, IRouteComponentProps } from 'umi';
import { dateFormatterToString, formatUploadFileToOSSFiles } from '@/utils/parser';
import {IManager, IManagerCert} from "@/interfaces/IManager";

interface ManagerCreateProps extends IRouteComponentProps {}

const ManagerCreate: React.FC<ManagerCreateProps> = ({ history }) => {
  const { run } = useRequest(createManager, {
    manual: true,
    onSuccess() {
      message.success('管理人员数据已经录入');
      history.push('/person/manager/list');
    },
    onError() {
      message.error('管理人员数据录入失败');
    },
  });

  const [form] = Form.useForm();

  const onFinish = (value: Partial<IManager>) => {
    dateFormatterToString(value);
    if (value.managerCerts) {
      value.managerCerts = value.managerCerts.map((item: IManagerCert) => {
        formatUploadFileToOSSFiles(item, 'Manager');
        if (item.id && item.id.toString().startsWith('new_')) {
          delete item.id;
        }
        return item;
      });
    }
    // @ts-ignore
    run(value);
  };

  const onFinishFailed = () => {
    message.warn('请检查表单数据');
  };

  return (
    <PageHeaderWrapper title="新建管理人员" content="输入管理人员信息及相关证书信息">
      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.name}
                name="name"
                rules={[{ required: true, message: `请输入 ${ManagerKeyMap.name}` }]}
              >
                <Input placeholder={`请输入 ${ManagerKeyMap.name}`} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.identityNumber}
                name="identityNumber"
                rules={[{ required: true, message: `请输入 ${ManagerKeyMap.identityNumber}` }]}
              >
                <Input placeholder={`请输入 ${ManagerKeyMap.identityNumber}`} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.gender}
                name="gender"
                rules={[{ required: true, message: `请选择 ${ManagerKeyMap.gender}` }]}
              >
                <Select placeholder={`请选择 ${ManagerKeyMap.gender}`}>
                  <Select.Option value={0}>男性</Select.Option>
                  <Select.Option value={1}>女性</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.managerPositionName}
                name="managerPositionId"
                rules={[{ required: true, message: `请输入 ${ManagerKeyMap.managerPositionName}` }]}
              >
                <CategorySelect category={'ManagerPositionType'} showNotChoose={false} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.managerDutyName}
                name="managerDutyId"
                rules={[{ required: true, message: `请输入 ${ManagerKeyMap.mobile}` }]}
              >
                <CategorySelect category={'ManagerDutyType'} showNotChoose={false} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.educationLevel}
                name="educationLevel"
                rules={[{ required: false, message: `请输入 ${ManagerKeyMap.educationLevel}` }]}
              >
                <Input placeholder={`请输入 ${ManagerKeyMap.educationLevel}`} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={ManagerKeyMap.mobile}
                name="mobile"
                rules={[{ required: true, message: `请输入 ${ManagerKeyMap.mobile}` }]}
              >
                <Input placeholder={`请输入 ${ManagerKeyMap.mobile}`} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label={ManagerKeyMap.remark}
                name="remark"
                rules={[{ required: false, message: `请输入 ${ManagerKeyMap.remark}` }]}
              >
                <Input placeholder={`请输入 ${ManagerKeyMap.remark}`} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className={styles.card} title="资格证书">
          <Form.Item name="managerCerts">
            <ManagerCertList />
          </Form.Item>
        </Card>

        <FooterToolbar>
          <Button type="primary" onClick={() => form?.submit()}>
            提交修改
          </Button>
        </FooterToolbar>
      </Form>
    </PageHeaderWrapper>
  );
};

export default ManagerCreate;
