import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IShip, IShipMachine } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { Card, Button, Table, Space, Divider, Popconfirm, Modal } from 'antd';
import { ShipMachineKeyMap } from '@/services/shipService';
import hooks from '@/pages/ship/profile/hooks';
import { PlusOutlined } from '@ant-design/icons';
import EditMachineForm from '@/pages/ship/edit/editMachineForm';
import useToggle from '@/hooks/useToggle';
import { ICommonOptionType } from '@/interfaces/ICategory';

interface ShipMachineFormProps {
  ship: Partial<IShip>;
  shipMachineType?: ICommonOptionType[];
  navigation: NavigationProps;
  onUpdate(ship: Partial<IShip>, save?: boolean): void;
}

const ShipMachineForm: React.FC<ShipMachineFormProps> = ({ ship, onUpdate, shipMachineType, navigation }) => {
  const [machines, setMachines] = useState<IShipMachine[]>(ship.shipMachines ?? []);
  const [editMachine, setEditMachine] = useState<Partial<IShipMachine>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    const unTapEditMachine = hooks.EditShipMachine.tap((machine) => {
      setEditMachine(machine);
      setRight();
    });

    const unTapDeleteMachine = hooks.DeleteShipMachine.tap((machine) => {
      setMachines((result) => {
        return result.filter((item) => item.id != machine.id);
      });
    });

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
      setMachines((machines) => {
        let idx = machines.findIndex((item) => item.id == machine.id);
        if (idx > -1) {
          machines[idx] = machine;
        }
        return [...machines];
      });
    } else {
      machine.id = Date.now();
      setMachines((machines) => {
        return [...machines, machine];
      });
    }
    setLeft();
    setEditMachine({});
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ShipMachineKeyMap.manufacturer,
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: ShipMachineKeyMap.shipMachineTypeName,
        dataIndex: 'shipMachineTypeName',
        key: 'shipMachineTypeName',
      },
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
      <Card bordered={false} title="船机信息">
        <Button
          className="mb-3 w-100"
          type={'dashed'}
          onClick={() => {
            onShowForm({});
          }}
        >
          <PlusOutlined />
          添加主机
        </Button>

        <Table
          key="id"
          pagination={false}
          dataSource={machines}
          columns={columns}
          locale={{
            emptyText: '无船机信息数据',
          }}
        />
      </Card>

      <Card bordered={false}>
        <Space style={{ float: 'right' }}>
          <Button
            onClick={() => {
              onUpdate({ shipMachines: machines });
              navigation.previous();
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onUpdate({ shipMachines: machines });
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
        <EditMachineForm
          runSave={false}
          machine={editMachine}
          machineTypes={shipMachineType}
          onUpdate={onMachineUpdate}
          onCancel={setLeft}
        />
      </Modal>
    </div>
  );
};

export default ShipMachineForm;
