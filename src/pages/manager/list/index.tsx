import React, { useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { PlusOutlined } from '@ant-design/icons';
import { deleteManager, getManagerDutyType, getManagerPositionType } from '@/services/managerService';
import { IManager } from '@/interfaces/IManager';
import useManagerTable from './useManagerTable';

const ManagerList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const { run: deleteRecord } = useRequest(deleteManager, {
    manual: true,
    onSuccess: () => {
      actionRef.current && actionRef.current.reload();
      message.success('已成功删除管理人员');
    },
    onError: err => {
      message.error('删除管理人员出错');
      console.error(err);
    },
  });

  const { data: dutyTypes } = useRequest(getManagerDutyType, {
    manual: false,
    cacheKey: 'managerDutyType',
    initialData: [],
  });

  const { data: positionTypes } = useRequest(getManagerPositionType, {
    manual: false,
    cacheKey: 'managerPositionType',
    initialData: [],
  });

  const { columns, request } = useManagerTable({ positionTypes, dutyTypes });

  return (
    <PageHeaderWrapper title="管理人员列表">
      <Card bordered={false}>
        <ProTable<IManager>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={}>
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
