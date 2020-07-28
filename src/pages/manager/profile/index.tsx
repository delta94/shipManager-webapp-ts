import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/hooks';
import { Descriptions, Card, List, Typography, Button } from 'antd';
import { infoManager, ManagerKeyMap } from '@/services/managerService';
import { IManagerCert } from '@/interfaces/IManager';
import { ManagerCertKeyMap } from '@/services/managerCertService';

const ManagerProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {

  const { data, run: fetchManager, loading } = useRequest(infoManager, {
    manual: true,
  });

  useEffect(() => {
    if (params.id) {
      fetchManager(parseInt(params.id));
    }
  }, [params.id]);

  return (
    <PageHeaderWrapper title="管理人员详情页">
      <Card bordered={false} loading={loading}>
        <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label={ManagerKeyMap.name}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.identityNumber}>{data?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.educationLevel}>{data?.educationLevel}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.mobile}>{data?.mobile}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.managerPositionName}>{data?.managerPositionName}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.managerDutyName}>{data?.managerDutyName}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.remark}>{data?.remark}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 24 }} loading={loading}>
        <Descriptions title="证书信息" />
        <List
          grid={{ gutter: 12, column: 3 }}
          dataSource={data?.managerCerts}
          renderItem={(item: IManagerCert) => (
            <List.Item>
              <Card title={item.name}>
                <Typography.Text strong>{ManagerCertKeyMap.identityNumber}</Typography.Text>: {item.identityNumber}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.expiredAt}</Typography.Text>: {item.expiredAt}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.issuedAt}</Typography.Text>: {item.issuedAt}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.managerCertTypeName}</Typography.Text>:{' '}
                {item.managerCertTypeName}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.issueDepartmentTypeName}</Typography.Text>:{' '}
                {item.issueDepartmentTypeName}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.remark}</Typography.Text>: {item.remark || '无'}
                <br />
                <Typography.Text strong>{ManagerCertKeyMap.ossFiles}</Typography.Text>:
                {item.ossFiles.map(item => {
                  return (
                    <Button type="link" href={item.ossKey} target="_blank">
                      {item.name}
                    </Button>
                  );
                })}
                <br />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ManagerProfile;
