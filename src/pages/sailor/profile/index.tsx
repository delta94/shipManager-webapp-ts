import React, { useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, List, Button, Avatar } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { IRouteComponentProps, useRequest } from 'umi';
import { infoSailor, SailorKeyMap } from '@/services/sailorService';
import { ISailor, ISailorCert } from '@/interfaces/ISailor';
import { ReactComponent as CertificateIcon } from '@/assets/svg/certificate.svg';
import styles from './style.less';

const { Item } = ProDescriptions;

const SailorProfile: React.FC<IRouteComponentProps<{ id: string }>> = ({ history, match: { params } }) => {
  const { data: sailor, loading } = useRequest(infoSailor, {
    refreshDeps: [params.id],
    defaultParams: [parseInt(params.id)],
  });

  const onDetails = useCallback(
    (id: string) => {
      history.push(`/person/sailor/license/${id}`);
    },
    [params.id],
  );

  return (
    <PageHeaderWrapper title="船员详情页">
      <Card title="基本信息" loading={loading} className="mb-4">
        <ProDescriptions<ISailor> column={3}>
          <Item label={SailorKeyMap.name}>{sailor?.name}</Item>
          <Item label={SailorKeyMap.gender} valueEnum={{ 0: '男性', 1: '女性' }}>
            {sailor?.gender}
          </Item>
          <Item label={SailorKeyMap.identityNumber}>{sailor?.identityNumber}</Item>
          <Item label={SailorKeyMap.birthDate}>{sailor?.birthDate}</Item>
        </ProDescriptions>
      </Card>

      <Card title="联系方式" loading={loading} className="mb-4">
        <ProDescriptions<ISailor> column={3}>
          <Item label={SailorKeyMap.mobile}>{sailor?.mobile}</Item>
          <Item label={SailorKeyMap.region}>{sailor?.region}</Item>
          <Item label={SailorKeyMap.address}>{sailor?.address}</Item>
          <Item label={SailorKeyMap.emergencyContactName}>{sailor?.emergencyContactName}</Item>
          <Item label={SailorKeyMap.emergencyContactMobile}>{sailor?.emergencyContactMobile}</Item>
        </ProDescriptions>
      </Card>

      <Card title="职业信息" loading={loading} className="mb-4">
        <ProDescriptions<ISailor> column={3}>
          <Item
            label={SailorKeyMap.isAdvanced}
            valueEnum={{
              false: { text: '不是', status: 'Default' },
              true: { text: '是', status: 'Success' },
            }}
          >
            {sailor?.isAdvanced}
          </Item>
          <Item label={SailorKeyMap.shipName}>{sailor?.shipName}</Item>
          <Item label={SailorKeyMap.licenseNumber}>{sailor?.licenseNumber}</Item>
          <Item label={SailorKeyMap.sailorDutyTypeName}>{sailor?.sailorDutyTypeName}</Item>
          <Item label={SailorKeyMap.contractExpiryAt}>{sailor?.contractExpiryAt}</Item>
          <Item label={SailorKeyMap.contractWorkAt}>{sailor?.contractWorkAt}</Item>
          <Item label={SailorKeyMap.remark}>{sailor?.remark}</Item>
        </ProDescriptions>
      </Card>

      <Card title="资格证书" className="mb-4">
        <List<ISailorCert>
          size="large"
          rowKey="id"
          pagination={false}
          dataSource={sailor?.sailorCerts}
          renderItem={(item: ISailorCert) => (
            <List.Item
              actions={[
                <Button type="link" key="edit" className="px-1" onClick={() => onDetails(item.id)}>
                  详情
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar shape="square" size="large" className="mt-1 bg-transparent" icon={<CertificateIcon />} />
                }
                title={item.name}
                description={`证书编号：${item.identityNumber}`}
              />
              <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                  <span>颁发机构</span>
                  <p>{item.issueDepartmentTypeName}</p>
                </div>
                <div className={styles.listContentItem}>
                  <span>颁发日期</span>
                  <p>{item.issuedAt}</p>
                </div>
                <div className={styles.listContentItem}>
                  <span>有效期至</span>
                  <p>{item.expiredAt}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default SailorProfile;
