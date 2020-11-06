import React, { useEffect, useMemo, useState } from 'react';
import { ShipMachineKeyMap } from '@/services/shipService';
import { IShipMachine } from '@/interfaces/IShip';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';
import { ICommonOptionType } from '@/interfaces/ICategory';

interface IUseMachineTableDeps {
  machines: IShipMachine[] | undefined;
  machineTypes: ICommonOptionType[] | undefined;
}

interface IUseMachineTableExport {
  tabList: any[];
  columns: any[];
  machines?: IShipMachine[] | undefined;
  tab: string;
  updateTab: (key: string) => void;
}

export default function useMachineTable(option: IUseMachineTableDeps): IUseMachineTableExport {
  const [tab, updateTab] = useState<string>('1');
  const [machines, updateMachines] = useState<IShipMachine[]>();

  const tabList = useMemo(() => {
    if (option.machineTypes) {
      return option.machineTypes.map((item) => {
        return {
          key: item.id.toString(),
          tab: item.name,
        };
      });
    }
    return [];
  }, [option.machineTypes]);

  useEffect(() => {
    if (!Array.isArray(option.machines)) return;
    let result = option.machines.filter((item) => item.shipMachineTypeId.toString() == tab);
    updateMachines(result);
  }, [tab, option.machines]);

  const columns = useMemo(() => {
    return [
      {
        title: ShipMachineKeyMap.manufacturer,
        dataIndex: 'manufacturer',
        key: 'manufacturer',
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
        render: (val: number) => `${val} 千瓦`,
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
