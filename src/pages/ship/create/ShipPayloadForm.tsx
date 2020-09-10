import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IShip, IShipPayload } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { Modal, Table, Card, Typography, Button, Divider, Popconfirm, Space } from 'antd';
import EditPayloadForm from '@/pages/ship/edit/editPayloadForm';
import useToggle from '@/hooks/useToggle';
import hooks from '@/pages/ship/profile/hooks';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';
import { PlusOutlined } from '@ant-design/icons';
import { ShipPayloadKeyMap } from '@/services/shipService';

interface ShipPayloadFormProps {
  ship: Partial<IShip>;
  navigation: NavigationProps;
  shipCategoryType?: Record<ICategory, ICommonOptionType[]>;
  onUpdate(ship: Partial<IShip>, save?: boolean): void;
}

const ShipPayloadForm: React.FC<ShipPayloadFormProps> = ({ ship, shipCategoryType, onUpdate, navigation }) => {
  const [payloads, setPayloads] = useState<IShipPayload[]>([]);

  const [editPayload, setEditPayload] = useState<Partial<IShipPayload>>();
  const { setLeft, setRight, state } = useToggle(false);

  useEffect(() => {
    const unTapDeletePayload = hooks.DeleteShipPayload.tap(payload => {
      setPayloads(payloads => {
        return payloads.filter(item => item.id != payload.id);
      });
    });
    const unTapEditShipPayload = hooks.EditShipPayload.tap(payload => {
      setEditPayload(payload);
      setRight();
    });

    if (ship.shipPayloads && ship.shipPayloads.length > 0) {
      setPayloads([...ship.shipPayloads]);
    }

    return () => {
      unTapDeletePayload();
      unTapEditShipPayload();
    };
  }, []);

  const onPayloadUpdate = useCallback(
    (payload: IShipPayload) => {
      if (!payload.shipBusinessAreaName && payload.shipBusinessAreaId != undefined) {
        // @ts-ignore
        payload.shipBusinessAreaName =
          // @ts-ignore
          shipCategoryType?.ShipBusinessAreaType?.find(item => item.id == payload.shipBusinessAreaId).name ?? '';
      }
      if (payload.id) {
        setPayloads(payloads => {
          let idx = payloads.findIndex(item => item.id == payload.id);
          if (idx > -1) {
            payloads[idx] = payload;
          }
          return [...payloads];
        });
      } else {
        payload.id = Date.now();
        setPayloads(payloads => {
          return [...payloads, payload];
        });
      }
      setLeft();
    },
    [shipCategoryType],
  );

  const columns = useMemo(() => {
    return [
      {
        title: ShipPayloadKeyMap.shipBusinessAreaName,
        dataIndex: 'shipBusinessAreaName',
        key: 'shipBusinessAreaName',
      },
      {
        title: ShipPayloadKeyMap.tone,
        dataIndex: 'tone',
        key: 'tone',
        render: (val: number) => `${val} 吨`,
      },
      {
        title: ShipPayloadKeyMap.remark,
        dataIndex: 'remark',
        key: 'remark',
        render: (val: string) => val ?? '无',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: IShipPayload) => (
          <>
            <a onClick={() => hooks.EditShipPayload.call(record)}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteShipPayload.call(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <Card bordered={false}>
        <Table
          key="id"
          pagination={false}
          dataSource={payloads}
          columns={columns}
          locale={{
            emptyText: '无载重吨数据',
          }}
          title={() => <Typography.Title level={4}>载重吨信息</Typography.Title>}
        />
        <Button
          type={'dashed'}
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => {
            setEditPayload({});
            setRight();
          }}
        >
          <PlusOutlined />
          添加载重吨
        </Button>
      </Card>

      <Card bordered={false}>
        <Space style={{ float: 'right' }}>
          <Button
            onClick={() => {
              onUpdate({ shipPayloads: [...payloads] });
              navigation.previous();
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onUpdate({ shipPayloads: [...payloads] });
              navigation.next();
            }}
          >
            下一步
          </Button>
        </Space>
      </Card>

      <Modal
        maskClosable={false}
        width={720}
        visible={state}
        title="编辑载重吨信息"
        destroyOnClose={true}
        footer={null}
        onCancel={setLeft}
      >
        <EditPayloadForm
          shipBusinessAreaType={shipCategoryType?.ShipBusinessAreaType ?? []}
          runSave={false}
          payload={editPayload}
          onUpdate={onPayloadUpdate}
          onCancel={setLeft}
        />
      </Modal>
    </div>
  );
};

export default ShipPayloadForm;
