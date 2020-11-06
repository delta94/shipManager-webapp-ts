import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { IRouteComponentProps, useRequest } from 'umi';
import { Card, Descriptions, List } from 'antd';
import { infoShipLicense, ShipLicenseKeyMap } from '@/services/shipLicenseService';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { FileImageOutlined } from '@ant-design/icons';
import { bytesToSize } from '@/utils/utils';

const InfoShipLicense: React.FC<IRouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  const { loading, data } = useRequest(infoShipLicense, {
    defaultParams: [parseInt(id)],
    refreshDeps: [id],
  });

  return (
    <PageHeaderWrapper title="船舶营运证信息">
      <Card bordered loading={loading}>
        <Descriptions title="基本信息">
          <Descriptions.Item label={ShipLicenseKeyMap.name}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.identityNumber}>{data?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.shipLicenseType}>{data?.shipLicenseTypeName}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.businessField}>{data?.businessField}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.expiredAt}>{data?.expiredAt}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.issuedAt}>{data?.issuedAt}</Descriptions.Item>
          <Descriptions.Item label={ShipLicenseKeyMap.remark}>{data?.remark}</Descriptions.Item>
        </Descriptions>
      </Card>

      <br />

      <Card title="电子件证书">
        <List<IOSSMetaFile>
          rowKey="id"
          loading={loading}
          grid={{
            column: 1,
          }}
          dataSource={data?.ossFiles}
          renderItem={(item) => (
            <List.Item style={{ margin: 6 }}>
              <a href={item.ossKey} target="_blank">
                <Card bordered={true} hoverable={true}>
                  <Card.Meta
                    title={item.name}
                    description={`文件大小: ${bytesToSize(item.size)} 
                     | 上传日期：${item.uploadAt}
                     | 上传者: ${item.uploadBy}`}
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

export default InfoShipLicense;
