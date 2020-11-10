import React, { useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest, history } from 'umi';
import { deleteManager } from '@/services/managerService';
import { IManager } from '@/interfaces/IManager';
import useManagerTable from './useManagerTable';
import { PlusOutlined } from '@ant-design/icons';
import hooks from '@/pages/manager/list/hooks';

const ManagerList: React.FC = () => {
  const { columns, request, actionRef, search } = useManagerTable({});

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

  const onCreate = useCallback(() => {
    history.push('/person/manager/create');
  }, []);

  useEffect(() => {
    const unTapDeleteManager = hooks.DeleteManager.tap((manager) => {
      deleteManagerRecord(manager.id);
    });
    const unTapInfoManager = hooks.InfoManager.tap((manager) => {
      history.push(`/person/manager/profile/${manager.id}`);
    });
    return () => {
      unTapDeleteManager();
      unTapInfoManager();
    };
  }, []);

  return (
    <PageHeaderWrapper title="管理人员列表">
      <Card bordered={false}>
        <ProTable<IManager>
          actionRef={actionRef}
          rowKey="id"
          search={search}
          columns={columns}
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" onClick={onCreate}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ManagerList;
