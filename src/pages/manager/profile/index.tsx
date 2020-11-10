import React from 'react';
import { RouteComponentProps } from 'react-router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import { Descriptions, Card, Button, Table, message, Modal } from 'antd';
import { infoManager, ManagerKeyMap, updateManager } from '@/services/managerService';
import { IManager, IManagerCert } from '@/interfaces/IManager';
import useManagerCertTable from './useManagerCertTable';
import useManagerEditForm from './useManagerEditForm';
import EditManagerBasicForm from './editManagerBasicForm';

const ManagerProfile: React.FC<RouteComponentProps<{ id: string }>> = ({ match: { params } }) => {
  const { data, loading, refresh } = useRequest(infoManager, {
    defaultParams: [parseInt(params.id)],
    onError() {
      message.error('管理人员不存在');
    },
  });

  const { run } = useRequest(updateManager, {
    manual: true,
  });

  const { columns } = useManagerCertTable({});

  const { editMangerVisible, editManger, onCloseEditManger, onShowEditManger } = useManagerEditForm({});

  const onSubmit = async (value: Partial<IManager>) => {
    // @ts-ignore
    await run(value);
    await refresh();
    onCloseEditManger({});
  };

  return (
    <PageHeaderWrapper title="管理人员详情页">
      <Card
        title="基本信息"
        bordered={false}
        loading={loading}
        extra={
          <Button type="link" onClick={() => onShowEditManger({ ...data })}>
            编辑
          </Button>
        }
      >
        <Descriptions>
          <Descriptions.Item label={ManagerKeyMap.name}>{data?.name}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.identityNumber}>{data?.identityNumber}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.educationLevel}>{data?.educationLevel}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.mobile}>{data?.mobile}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.managerPositionName}>{data?.managerPositionName}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.managerDutyName}>{data?.managerDutyName}</Descriptions.Item>
          <Descriptions.Item label={ManagerKeyMap.remark}>{data?.remark}</Descriptions.Item>
        </Descriptions>
      </Card>

      <br />

      <Card title="管理人员证书" extra={<Button type="link">新增证书</Button>}>
        <Table<IManagerCert>
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={data?.managerCerts}
          columns={columns}
        />
      </Card>

      <Modal
        width={640}
        visible={editMangerVisible}
        onCancel={onCloseEditManger}
        destroyOnClose={true}
        footer={null}
        title="更新管理人员"
      >
        <EditManagerBasicForm manager={editManger} onSubmit={onSubmit} onReset={onCloseEditManger} />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default ManagerProfile;
