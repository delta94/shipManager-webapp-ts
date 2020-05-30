import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Descriptions, Divider, List } from 'antd';
import { RouteComponentProps } from 'react-router';
import { useRequest } from '@umijs/hooks';
import { FilePdfTwoTone } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { infoSailor } from '@/services/sailor';
import OSSClient from '@/utils/OSSClient';
import { bytesToSize } from '@/utils/utils';

const SailorDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const { data: sailor } = useRequest(() => infoSailor(parseInt(params.id)), {
    cacheKey: `sailor_info_${params.id}`,
    refreshDeps: [params.id],
  });

  const downloadFile = async (file: UploadFile) => {
    let client = await OSSClient.getInstance();
    let downloadUrl = client.signatureUrl(file.url || '');
    var anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.target = '_blank';
    anchor.download = file.name;
    anchor.click();
  };

  return (
    <PageHeaderWrapper title="船员详情页">
      <Card bordered={false}>
        <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="船员名">{sailor?.name}</Descriptions.Item>
          <Descriptions.Item label="是否高级船员">
            {sailor?.isAdvanced ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="身份证号码">{sailor?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label="职位">{sailor?.positionName}</Descriptions.Item>
          <Descriptions.Item label="住址">{sailor?.address}</Descriptions.Item>
        </Descriptions>

        <Divider style={{ marginBottom: 32 }} />

        <Descriptions title="船员电子件信息" style={{ marginBottom: 32 }}>
          <div>
            <List
              bordered
              itemLayout="horizontal"
              dataSource={(sailor && sailor.ex_certFile) || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      key="list-edit"
                      onClick={() => {
                        downloadFile(item);
                      }}
                    >
                      下载
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FilePdfTwoTone style={{ fontSize: '32px' }} />}
                    title={item.name}
                    description={bytesToSize(item.size)}
                  />
                </List.Item>
              )}
            />
          </div>
        </Descriptions>
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorDetails;
