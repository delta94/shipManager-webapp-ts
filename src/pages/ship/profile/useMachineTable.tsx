import React, { useEffect, useMemo, useState } from 'react';
import { ShipMachineKeyMap } from '@/services/shipService';
import { IShipMachine } from '@/interfaces/IShip';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';

interface IUseMachineTableDeps {
  machines: IShipMachine[] | undefined;
}

interface IUseMachineTableExport {
  tabList: any[];
  columns: any[];
  machines?: IShipMachine[] | undefined;
  tab: string;
  updateTab: (key: string) => void;
}

export default function useMachineTable(option: IUseMachineTableDeps): IUseMachineTableExport {
  const [tab, updateTab] = useState<string>('host');
  const [machines, updateMachines] = useState<IShipMachine[]>();

  useEffect(() => {
    if (!Array.isArray(option.machines)) return;
    if (tab == 'host') {
      let result = option.machines.filter((item) => item.machineType == 0);
      updateMachines(result);
    } else {
      let result = option.machines.filter((item) => item.machineType == 1);
      updateMachines(result);
    }
  }, [tab, option.machines]);

  const tabList = useMemo(() => {
    return [
      {
        key: 'host',
        tab: '船舶主机',
      },
      {
        key: 'generator',
        tab: '船舶发电机',
      },
    ];
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

  return {
    tabList,
    columns,
    tab,
    updateTab,
    machines,
  };
}
