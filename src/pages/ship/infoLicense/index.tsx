import React, { useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { IRouteComponentProps, useRequest } from 'umi';
import { Card, Descriptions, List, Modal, Button } from 'antd';
import { infoShipLicense, ShipLicenseKeyMap } from '@/services/shipLicenseService';
import IOSSMetaFile from '@/interfaces/IOSSMetaFile';
import { FileImageOutlined } from '@ant-design/icons';
import { bytesToSize } from '@/utils/utils';
import useLicenseForm from '@/pages/ship/profile/useLicenseForm';
import EditLicenseForm from '@/pages/ship/edit/editLicenseForm';
import { listOptions } from '@/services/globalService';

const InfoShipLicense: React.FC<IRouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  const { loading, data, refresh } = useRequest(infoShipLicense, {
    defaultParams: [parseInt(id)],
    refreshDeps: [id],
  });

  const { editLicense, editLicenseVisible, onCloseEditLicense, onShowEditLicense } = useLicenseForm({
    refreshShipInfo: refresh,
  });

  const onClick = useCallback(() => {
    data && onShowEditLicense(data);
  }, [data]);

  const onUpdate = () => {
    refresh();
    onCloseEditLicense({});
  };

  const { data: shipCategoryType } = useRequest(listOptions, {
    manual: false,
    defaultParams: [
      [
        'ShipBusinessAreaType',
        'ShipMaterialType',
        'ShipType',
        'ShipLicenseType',
        'IssueDepartmentType',
        'ShipMachineType',
      ],
    ],
    cacheKey: 'ship_category_type',
  });

  return (
    <PageHeaderWrapper title="船舶营运证信息">
      <Card
        title="基本信息"
        bordered
        loading={loading}
        extra={
          <Button type="link" onClick={onClick}>
            编辑
          </Button>
        }
      >
        <Descriptions>
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
      <Modal
        maskClosable={false}
        width={720}
        visible={editLicenseVisible}
        title="编辑营运证信息"
        destroyOnClose={true}
        footer={null}
        onCancel={onCloseEditLicense}
      >
        <EditLicenseForm
          shipLicenseType={shipCategoryType?.ShipLicenseType ?? []}
          issueDepartmentType={shipCategoryType?.IssueDepartmentType ?? []}
          license={editLicense}
          onUpdate={onUpdate}
          onCancel={onCloseEditLicense}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default InfoShipLicense;
