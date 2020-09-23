import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IShip, IShipMachine } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { Card, Button, Table, Space, Divider, Popconfirm, Typography, Modal } from 'antd';
import { ShipMachineKeyMap } from '@/services/shipService';
import hooks from '@/pages/ship/profile/hooks';
import { PlusOutlined } from '@ant-design/icons';
import EditMachineForm from '@/pages/ship/edit/editMachineForm';
import useToggle from '@/hooks/useToggle';

interface ShipMachineFormProps {
  ship: Partial<IShip>;
  navigation: NavigationProps;
  onUpdate(ship: Partial<IShip>, save?: boolean): void;
}

const ShipMachineForm: React.FC<ShipMachineFormProps> = ({ ship, onUpdate, navigation }) => {
  const [generators, setGenerator] = useState<IShipMachine[]>([]);
  const [host, setHost] = useState<IShipMachine[]>([]);

  const [editMachine, setEditMachine] = useState<Partial<IShipMachine>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    const unTapEditMachine = hooks.EditShipMachine.tap((machine) => {
      setEditMachine(machine);
      setRight();
    });

    const unTapDeleteMachine = hooks.DeleteShipMachine.tap((machine) => {
      if (machine.machineType == 0) {
        setHost((hosts) => {
          return hosts.filter((item) => item.id != machine.id);
        });
      }
      if (machine.machineType == 1) {
        setGenerator((generators) => {
          return generators.filter((item) => item.id != machine.id);
        });
      }
    });

    if (ship.shipMachines && ship.shipMachines.length > 0) {
      setHost(ship.shipMachines.filter((item) => item.machineType == 0));
      setGenerator(ship.shipMachines.filter((item) => item.machineType == 1));
    }

    return () => {
      unTapEditMachine();
      unTapDeleteMachine();
    };
  }, []);

  const onShowForm = useCallback((machine: Partial<IShipMachine>) => {
    setEditMachine(machine);
    setRight();
  }, []);

  const onMachineUpdate = useCallback((machine: IShipMachine) => {
    if (machine.id) {
      if (machine.machineType == 0) {
        setHost((hosts) => {
          let idx = hosts.findIndex((item) => item.id == machine.id);
          if (idx > -1) {
            hosts[idx] = machine;
          }
          return [...hosts];
        });
      }
      if (machine.machineType == 1) {
        setGenerator((generators) => {
          let idx = generators.findIndex((item) => item.id == machine.id);
          if (idx > -1) {
            generators[idx] = machine;
          }
          return [...generators];
        });
      }
    } else {
      machine.id = Date.now();
      if (machine.machineType == 0) {
        setHost((hosts) => {
          return [...hosts, machine];
        });
      }
      if (machine.machineType == 1) {
        setGenerator((generators) => {
          return [...generators, machine];
        });
      }
    }
    setLeft();
    setEditMachine({});
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
        <Button
          type={'dashed'}
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => {
            onShowForm({
              machineType: 0,
            });
          }}
        >
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
        <Button
          type={'dashed'}
          style={{ width: '100%', marginTop: 8 }}
          onClick={() =>
            onShowForm({
              machineType: 1,
            })
          }
        >
          <PlusOutlined />
          添加发电机
        </Button>
      </Card>

      <Card bordered={false}>
        <Space style={{ float: 'right' }}>
          <Button
            onClick={() => {
              onUpdate({ shipMachines: [...host, ...generators] });
              navigation.previous();
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onUpdate({ shipMachines: [...host, ...generators] });
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
        title="编辑船机信息"
        destroyOnClose={true}
        footer={null}
        onCancel={setLeft}
      >
        <EditMachineForm runSave={false} machine={editMachine} onUpdate={onMachineUpdate} onCancel={setLeft} />
      </Modal>
    </div>
  );
};

export default ShipMachineForm;
