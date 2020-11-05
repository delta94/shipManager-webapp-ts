import React, { useState, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message, Modal } from 'antd';
import { useRequest, history } from 'umi';
import { deleteManager } from '@/services/managerService';
import { IManager } from '@/interfaces/IManager';
import useManagerTable from './useManagerTable';
import { PlusOutlined } from '@ant-design/icons';
import hooks from '@/pages/manager/list/hooks';
import EditManagerForm from '../edit/editManagerForm';
import useToggle from '@/hooks/useToggle';
import { listOptions } from '@/services/globalService';

const ManagerList: React.FC = () => {
  const [editManagerVisible, { setLeft: hideEdit, setRight: showEdit }] = useToggle();

  const [editManager, updateEditManager] = useState<IManager>();

  const { data: managerCategoryType } = useRequest(listOptions, {
    manual: false,
    defaultParams: [['ManagerDutyType', 'ManagerPositionType', 'ManagerCertType', 'IssueDepartmentType']],
    cacheKey: 'manager_category_type',
  });

  const { columns, request, actionRef, search } = useManagerTable({
    positionTypes: managerCategoryType?.ManagerPositionType ?? [],
    dutyTypes: managerCategoryType?.ManagerDutyType ?? [],
  });

  const { run: deleteManagerRecord } = useRequest(deleteManager, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除管理人员');
    },
    onError: (err) => {
      message.error('删除管理人员时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteManager = hooks.DeleteManager.tap((manager) => {
      deleteManagerRecord(manager.id);
    });
    const unTapInfoManager = hooks.InfoManager.tap((manager) => {
      history.push(`/person/manager/profile/${manager.id}`);
    });
    const unTapEditManager = hooks.EditManager.tap((manager) => {
      updateEditManager(manager);
      showEdit();
    });
    return () => {
      unTapDeleteManager();
      unTapInfoManager();
      unTapEditManager();
    };
  }, []);

  const onEditManagerUpdate = useCallback(() => {
    actionRef.current?.reload();
    updateEditManager(undefined);
    hideEdit();
  }, []);

  const onEditManagerCancel = useCallback(() => {
    updateEditManager(undefined);
    hideEdit();
  }, []);

  return (
    <PageHeaderWrapper title="管理人员列表">
      <Card bordered={false}>
        <ProTable<IManager>
          actionRef={actionRef}
          rowKey="id"
          search={search}
          columns={columns}
          //@ts-ignore
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" onClick={showEdit}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
      <Modal
        onCancel={onEditManagerCancel}
        destroyOnClose
        width={720}
        footer={null}
        visible={editManagerVisible}
        title={editManager ? '编辑管理人员' : '新建管理人员'}
      >
        <EditManagerForm
          positionTypes={managerCategoryType?.ManagerPositionType ?? []}
          dutyTypes={managerCategoryType?.ManagerDutyType ?? []}
          issueDepartmentTypes={managerCategoryType?.IssueDepartmentType ?? []}
          managerCertTypes={managerCategoryType?.ManagerCertType ?? []}
          onUpdate={onEditManagerUpdate}
          onCancel={onEditManagerCancel}
          manager={editManager}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default ManagerList;
