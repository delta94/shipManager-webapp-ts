import React, { useEffect } from 'react';
import { IRouteComponentProps } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import { Descriptions, Card, Button, Table, message, Modal } from 'antd';
import { infoManager, ManagerKeyMap, updateManager } from '@/services/managerService';
import { createManagerCert, deleteManagerCert, updateManagerCert } from '@/services/managerCertService';
import { IManager, IManagerCert } from '@/interfaces/IManager';
import useManagerCertTable from './useManagerCertTable';
import useManagerEditForm from './useManagerEditForm';
import EditManagerBasicForm from './editManagerBasicForm';
import EditManagerCertForm from '@/pages/manager/create/editManagerCertForm';
import useMangerCertEditForm from '@/pages/manager/profile/useMangerCertEditForm';
import hooks from './hooks';

const ManagerProfile: React.FC<IRouteComponentProps<{ id: string }>> = ({ match: { params }, history }) => {
  const { data, loading, refresh } = useRequest(infoManager, {
    defaultParams: [parseInt(params.id)],
    onError() {
      message.error('管理人员不存在');
    },
  });

  const { run: runUpdateManagerBasic } = useRequest(updateManager, {
    manual: true,
  });

  const { run: runCreateManagerCert } = useRequest(createManagerCert, {
    manual: true,
    onError() {
      message.error('管理人员证书创建失败');
    },
    onSuccess() {
      message.success('管理人员证书已经录入');
    },
  });

  const { run: runUpdateManagerCert } = useRequest(updateManagerCert, {
    manual: true,
    onError() {
      message.error('管理人员更新失败');
    },
    onSuccess() {
      message.success('管理人员证书已经更新');
    },
  });

  const { run: runDeleteManagerCert } = useRequest(deleteManagerCert, {
    manual: true,
    onError() {
      message.error('管理人员证书删除失败');
    },
    onSuccess() {
      message.success('管理人员证书已删除');
    },
  });

  const { columns } = useManagerCertTable({});

  const { editMangerVisible, editManger, onCloseEditManger, onShowEditManger } = useManagerEditForm();

  const {
    editMangerCertVisible,
    editMangerCert,
    onCloseEditMangerCert,
    onShowEditMangerCert,
  } = useMangerCertEditForm();

  const onBasicSubmit = async (value: Partial<IManager>) => {
    await runUpdateManagerBasic(value as IManager);
    await refresh();
    onCloseEditManger({});
  };

  const onCertSubmit = async (value: Partial<IManagerCert>) => {
    if (value.id && value.id.toString().startsWith('new')) {
      delete value.id;
      await runCreateManagerCert(value as IManagerCert);
    } else {
      await runUpdateManagerCert(value as IManagerCert);
    }

    await refresh();
    onCloseEditMangerCert({});
  };

  useEffect(() => {
    const unTapDeleteManagerCert = hooks.DeleteManagerCert.tap((value) => {
      runDeleteManagerCert(value.id);
    });
    const unTapEditManagerCert = hooks.EditManagerCert.tap((value) => {
      onShowEditMangerCert({ ...value });
    });
    const unTapInfoManagerCert = hooks.InfoManagerCert.tap((value) => {
      history.push(`/person/manager/certificate/${value.id}`);
    });

    return () => {
      unTapDeleteManagerCert();
      unTapEditManagerCert();
      unTapInfoManagerCert();
    };
  }, []);

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

      <Card
        title="管理人员证书"
        extra={
          <Button type="link" onClick={() => onShowEditMangerCert({ managerId: parseInt(params.id) })}>
            新增证书
          </Button>
        }
      >
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
        <EditManagerBasicForm manager={editManger} onSubmit={onBasicSubmit} onCancel={onCloseEditManger} />
      </Modal>

      <Modal
        width={640}
        visible={editMangerCertVisible}
        destroyOnClose={true}
        onCancel={onCloseEditMangerCert}
        footer={null}
        title="编辑管理人员证书"
      >
        <EditManagerCertForm managerCert={editMangerCert} onSubmit={onCertSubmit} onCancel={onCloseEditMangerCert} />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default ManagerProfile;
