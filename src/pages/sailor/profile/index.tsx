import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import { Descriptions, Card, List, Typography, Button } from 'antd';
import { infoSailor, SailorKeyMap } from '@/services/sailorService';
import { ISailorCert } from '@/interfaces/ISailor';
import { SailorCertKeyMap } from '@/services/sailorCertService';

const SailorProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const { data, run: fetchSailor, loading } = useRequest(infoSailor, {
    manual: true,
  });

  useEffect(() => {
    if (params.id) {
      fetchSailor(parseInt(params.id));
    }
  }, [params.id]);

  return (
    <PageHeaderWrapper title="船员详情页">
      <Card bordered={false} loading={loading}>
        <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label={SailorKeyMap.name}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.gender}>{data?.gender ?? 0 ? '男' : '女'}</Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.sailorDutyTypeName}>{data?.sailorDutyTypeName}</Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.identityNumber}>{data?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.licenseNumber}>{data?.licenseNumber}</Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.birthDate}>{data?.birthDate}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.birthDate}>{data?.contractWorkAt}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.birthDate}>{data?.contractExpiryAt}</Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.mobile}>{data?.mobile}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.region}>{data?.region}</Descriptions.Item>
          <Descriptions.Item label={SailorKeyMap.address}>{data?.address}</Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.isAdvanced}>
            {data?.isAdvanced ?? false ? '是' : '否'}
          </Descriptions.Item>

          <Descriptions.Item label={SailorKeyMap.remark}>{data?.remark}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginTop: 24 }} loading={loading}>
        <Descriptions title="证书信息" />
        <List
          rowKey="id"
          grid={{ gutter: 12, column: 3 }}
          dataSource={data?.sailorCerts}
          renderItem={(item: ISailorCert) => (
            <List.Item>
              <Card title={item.name}>
                <Typography.Text strong>{SailorCertKeyMap.identityNumber}</Typography.Text>: {item.identityNumber}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.expiredAt}</Typography.Text>: {item.expiredAt}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.issuedAt}</Typography.Text>: {item.issuedAt}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.sailorCertTypeName}</Typography.Text>:{' '}
                {item.sailorCertTypeName}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.issueDepartmentTypeName}</Typography.Text>:{' '}
                {item.issueDepartmentTypeName}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.remark}</Typography.Text>: {item.remark || '无'}
                <br />
                <Typography.Text strong>{SailorCertKeyMap.ossFiles}</Typography.Text>:
                {item.ossFiles.map((item) => {
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

export default SailorProfile;
