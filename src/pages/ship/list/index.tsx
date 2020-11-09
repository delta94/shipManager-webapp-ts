import React, { useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest } from 'umi';
import { deleteShip } from '@/services/shipService';
import { listOptions } from '@/services/globalService';
import { IShip } from '@/interfaces/IShip';
import useShipTable from './useShipTable';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import hooks from './hooks';

const ShipList: React.FC = () => {
  const { data: shipCategoryType } = useRequest(listOptions, {
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

  const { columns, request, search, actionRef, formRef } = useShipTable({
    shipCategoryType: shipCategoryType,
  });

  const { run: deleteShipRecord } = useRequest(deleteShip, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除船舶');
    },
    onError: (err) => {
      message.error('删除船舶时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteShip = hooks.DeleteShip.tap((ship) => {
      deleteShipRecord(ship.id);
    });

    const unTapInfoShip = hooks.InfoShip.tap((ship) => {
      history.push(`/ship/profile/${ship.id}`);
    });

    return () => {
      unTapDeleteShip();
      unTapInfoShip();
    };
  }, []);

  const onCreateShip = useCallback(() => {
    history.push('/ship/create');
  }, []);

  return (
    <PageHeaderWrapper title="船舶列表">
      <Card bordered={false}>
        <ProTable<IShip>
          actionRef={actionRef}
          rowKey="id"
          formRef={formRef}
          search={search}
          columns={columns}
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button type="primary" onClick={onCreateShip} key="create">
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ShipList;
