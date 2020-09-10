import { ProColumns } from '@ant-design/pro-table';
import React, { useMemo } from 'react';
import { Divider, Popconfirm, Select } from 'antd';
import hooks from './hooks';
import { ShipKeyMap, listShip } from '@/services/shipService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { IShip, IShipBusinessAreaType, IShipMaterialType, IShipType } from '@/interfaces/IShip';

interface IUseShipTableDeps {
  shipType: IShipType[];
  shipMaterialType: IShipMaterialType[];
  shipBusinessAreaType: IShipBusinessAreaType[];
}

interface IUseShipTableExport {
  columns: ProColumns<IShip>[];
  request: Function;
}

export default function useShipTable(options: IUseShipTableDeps): IUseShipTableExport {
  const columns = useMemo(() => {
    return [
      {
        title: ShipKeyMap.name,
        dataIndex: 'name',
      },
      {
        title: ShipKeyMap.carrierIdentifier,
        dataIndex: 'carrierIdentifier',
        hideInSearch: true,
      },
      {
        title: ShipKeyMap.shipTypeName,
        dataIndex: 'shipTypeName',
        hideInSearch: true,
      },
      {
        title: ShipKeyMap.shipTypeName,
        hideInTable: true,
        hideInSearch: false,
        dataIndex: 'shipTypeId',
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onChange={props.onChange}>
              <Select.Option key={99} value={-1}>
                不限类型
              </Select.Option>
              {options.shipType?.map((item, index) => {
                return (
                  <Select.Option value={item.id} key={index}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: ShipKeyMap.owner,
        dataIndex: 'owner',
        hideInSearch: true,
      },
      {
        title: ShipKeyMap.grossTone,
        dataIndex: 'grossTone',
        hideInSearch: true,
        render: val => `${val} 吨`,
      },
      {
        title: '操作',
        render: (text: any, record: IShip) => (
          <>
            <a onClick={() => hooks.InfoShip.call(record)}>更多</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" placement={'left'} onConfirm={() => hooks.DeleteShip.call(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ] as ProColumns<IShip>[];
  }, [options.shipType]);

  const requestList = async (params: IPageableFilter<IShip>) => {
    let { current = 0, pageSize = 20 } = params;
    let extra = {};

    if (params.name !== undefined) {
      extra['name.contains'] = params.name;
    }

    if (params.shipTypeId !== undefined && params.shipTypeId != -1) {
      extra['shipTypeId.equals'] = params.shipTypeId;
    }

    const data = await listShip(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  return {
    columns,
    request: requestList,
  };
}
