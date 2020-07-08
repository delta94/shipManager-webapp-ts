import React from 'react';
import { RouteComponentProps } from 'react-router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/hooks';
import { Descriptions, Table, Card } from 'antd';
import { infoManager } from '@/services/manager';
import { IManager } from '@/interfaces/IManager';

const ManagerProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  var { data } = useRequest(() => infoManager(parseInt(params.id)), {
    cacheKey: `manager_profile_${params.id}`,
    refreshDeps: [params.id],
  });

  const managerInfo = (data || {}) as IManager;

  const certsColumns = [
    {
      title: '证书名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '证书类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '证书编号',
      dataIndex: 'identityNumber',
      key: 'identityNumber',
    },
    {
      title: '到期时间',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
    },
  ];

  return (
    <PageHeaderWrapper title="管理人员详情页">
      <Card bordered={false}>
        <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="管理人员姓名">{managerInfo.name}</Descriptions.Item>
          <Descriptions.Item label="身份证号码">{managerInfo.identityNumber}</Descriptions.Item>
          <Descriptions.Item label="指定职位">{managerInfo.assignerName}</Descriptions.Item>
          <Descriptions.Item label="手机号码">{managerInfo.mobile}</Descriptions.Item>
          <Descriptions.Item label="部门">{managerInfo.dept}</Descriptions.Item>
          <Descriptions.Item label="职务">{managerInfo.position}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Descriptions title="证书信息" />
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={managerInfo.certs}
          columns={certsColumns}
          rowKey="id"
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ManagerProfile;
