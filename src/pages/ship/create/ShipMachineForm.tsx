import React, { useState, useEffect, useMemo } from 'react';
import { IShip, IShipMachine } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';
import { Card, Button, Table, Space, Divider, Popconfirm, Typography, Empty, Modal } from 'antd';
import { ShipMachineKeyMap } from '@/services/shipService';
import hooks from '@/pages/ship/profile/hooks';
import { PlusOutlined } from '@ant-design/icons';
import EditMachineForm from '@/pages/ship/edit/editMachineForm';
import { useToggle } from '@umijs/hooks';

interface ShipMachineFormProps {
  ship: Partial<IShip>;
  navigation: NavigationProps;
  shipCategoryType?: Record<ICategory, ICommonOptionType[]>;
  onUpdate(ship: Partial<IShip>): void;
}

const ShipMachineForm: React.FC<ShipMachineFormProps> = ({ shipCategoryType, ship, onUpdate, navigation }) => {
  const [generators, setGenerator] = useState<IShipMachine[]>();
  const [host, setHost] = useState<IShipMachine[]>();
  const [editMachine, setEditMachine] = useState<Partial<IShipMachine>>();
  const { setLeft, setRight, state } = useToggle(false);

  useEffect(() => {
    const unTapEditMachine = hooks.EditShipMachine.tap(machine => {
      setEditMachine(machine);
      setRight();
    });

    const unTapDeleteMachine = hooks.DeleteShipMachine.tap(machine => {
      //todo
    });

    return () => {
      unTapEditMachine();
      unTapDeleteMachine();
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ShipMachineKeyMap.model,
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: ShipMachineKeyMap.power,
        dataIndex: 'power',
        key: 'power',
        render: (val: number) => `${val} KW`,
      },
      {
        title: ShipMachineKeyMap.remark,
        dataIndex: 'remark',
        key: 'remark',
        render: (val: string) => val ?? '无',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: IShipMachine) => (
          <>
            <a onClick={() => hooks.InfoShipMachine.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditShipMachine.call(record)}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteShipMachine.call(record)}>
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
          dataSource={host}
          columns={columns}
          locale={{
            emptyText: '无主机数据',
          }}
          title={() => <Typography.Title level={4}>船舶主机</Typography.Title>}
        />
        <Button type={'dashed'} style={{ width: '100%', marginTop: 8 }} onClick={setRight}>
          <PlusOutlined />
          添加主机
        </Button>
      </Card>

      <Card bordered={false}>
        <Table
          locale={{
            emptyText: '无发电机数据',
          }}
          key="id"
          pagination={false}
          dataSource={generators}
          columns={columns}
          title={() => <Typography.Title level={4}>船舶发电机</Typography.Title>}
        />
        <Button type={'dashed'} style={{ width: '100%', marginTop: 8 }} onClick={setRight}>
          <PlusOutlined />
          添加发电机
        </Button>
      </Card>

      <Card bordered={false}>
        <Space>
          <Button
            onClick={() => {
              navigation.previous();
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
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
        title={`编辑船舶${'d' == 'host' ? '主机' : '发电机'}信息`}
        destroyOnClose={true}
        footer={null}
        onCancel={setLeft}
      >
        <EditMachineForm machine={editMachine} onUpdate={setLeft} onCancel={setLeft} />
      </Modal>
    </div>
  );
};

export default ShipMachineForm;
