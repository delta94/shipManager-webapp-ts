import React, { useRef, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Button, Card, message } from 'antd';
import { useRequest } from '@umijs/hooks';
import { deleteShip, listShipCategory } from '@/services/shipService';
import { IShip } from '@/interfaces/IShip';
import useShipTable from './useShipTable';
import { PlusOutlined } from '@ant-design/icons';
// import EditShipForm from '../edit/editShipForm';
import { useDispatch, routerRedux } from 'dva';
import hooks from './hooks';

const ShipList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const dispatch = useDispatch();

  const { run: deleteShipRecord } = useRequest(deleteShip, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('已成功删除船舶');
    },
    onError: err => {
      message.error('删除船舶时出错');
      console.error(err);
    },
  });

  useEffect(() => {
    const unTapDeleteShip = hooks.DeleteShip.tap(ship => {
      deleteShipRecord(ship.id);
    });

    const unTapInfoShip = hooks.InfoShip.tap(ship => {
      dispatch(routerRedux.push(`/ship/profile/${ship.id}`));
    });

    return () => {
      unTapDeleteShip();
      unTapInfoShip();
    };
  }, []);

  const { data: shipCategoryType } = useRequest(listShipCategory, {
    manual: false,
    cacheKey: 'ship_category_type',
  });

  const { columns, request } = useShipTable({
    shipType: shipCategoryType?.ShipType ?? [],
    shipMaterialType: shipCategoryType?.ShipMaterialType ?? [],
    shipBusinessAreaType: shipCategoryType?.ShipBusinessAreaType ?? [],
  });

  const onCreateShip = useCallback(() => {
    dispatch(routerRedux.push(`/ship/create`));
  }, []);

  return (
    <PageHeaderWrapper title="船舶列表">
      <Card bordered={false}>
        <ProTable<IShip>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          //@ts-ignore
          request={request}
          dateFormatter="string"
          toolBarRender={() => [
            <Button type="primary" onClick={onCreateShip}>
              <PlusOutlined />
              新建
            </Button>
          ]}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default ShipList;
