import React from 'react';
import { RouteComponentProps } from 'react-router';
import { infoCompanyLicense } from '@/services/company';
import { FilePdfTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from '@umijs/hooks';
import { Descriptions, Divider, Typography, Card, List } from 'antd';
import { ICompanyLicense } from '@/interfaces/ICompany';
import { UploadFile } from 'antd/lib/upload/interface';
import OSSClient from '@/utils/OSSClient';
import { bytesToSize } from '@/utils/utils';

const CompanyLicenseProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  var { data } = useRequest(() => infoCompanyLicense(parseInt(params.id)), {
    cacheKey: `company_lic_${params.id}`,
    refreshDeps: [params.id],
  });

  const companyLicense = (data || {}) as ICompanyLicense;

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
    <PageHeaderWrapper title="公司批文详情页">
      <Card bordered={false}>
        <Descriptions title="基本信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="批文名">{companyLicense.name}</Descriptions.Item>
          <Descriptions.Item label="批文编号">{companyLicense.identityNumber}</Descriptions.Item>
          <Descriptions.Item label="批文有效期">{companyLicense.expireAt}</Descriptions.Item>
        </Descriptions>

        <Divider style={{ marginBottom: 32 }} />

        <Descriptions title="备注信息" style={{ marginBottom: 32 }}>
          <Typography.Text>{companyLicense.remark || '暂无备注'}</Typography.Text>
        </Descriptions>

        <Divider style={{ marginBottom: 32 }} />

        <Descriptions title="电子件信息" style={{ marginBottom: 32 }}>
          <div>
            <List
              bordered
              itemLayout="horizontal"
              dataSource={(data && data.ex_ossFile) || []}
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

export default CompanyLicenseProfile;
