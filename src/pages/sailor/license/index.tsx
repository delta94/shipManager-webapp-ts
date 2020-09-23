import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { IRouteComponentProps, useRequest } from 'umi';
import { SailorCertKeyMap, infoSailorCertInfo } from '@/services/sailorCertService';
import { Card, Descriptions, List } from 'antd';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { FileImageOutlined } from '@ant-design/icons';
import { bytesToSize } from '@/utils/utils';

const SailorCert: React.FC<IRouteComponentProps<{ id: string }>> = ({
                                                                           match: {
                                                                             params: { id },
                                                                           },
                                                                         }) => {
  const { loading, data } = useRequest(infoSailorCertInfo, {
    defaultParams: [parseInt(id)],
    refreshDeps: [id],
  });

  return (
    <PageHeaderWrapper title="船员证书详情">
      <Card bordered loading={loading}>
        <Descriptions title="基本信息">
          <Descriptions.Item label={SailorCertKeyMap.name}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={SailorCertKeyMap.identityNumber}>{data?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label={SailorCertKeyMap.sailorCertTypeName}>
            {data?.sailorCertTypeName}
          </Descriptions.Item>
          <Descriptions.Item label={SailorCertKeyMap.expiredAt}>{data?.expiredAt}</Descriptions.Item>
          <Descriptions.Item label={SailorCertKeyMap.issuedAt}>{data?.issuedAt}</Descriptions.Item>
          <Descriptions.Item label={SailorCertKeyMap.remark}>{data?.remark}</Descriptions.Item>
        </Descriptions>
      </Card>

      <br />

      <Card title="电子件证书">
        <List<IOSSMetaFile>
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            column: 4,
          }}
          dataSource={data?.ossFiles}
          renderItem={(item) => (
            <List.Item style={{ margin: 6 }}>
              <a href={item.ossKey} target="_blank">
                <Card bordered={true} hoverable={true}>
                  <Card.Meta
                    title={item.name}
                    description={`文件大小: ${bytesToSize(item.size)}`}
                    avatar={<FileImageOutlined style={{ fontSize: 42, color: '#555' }} />}
                  />
                </Card>
              </a>
            </List.Item>
          )}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorCert;
