import { ProColumns } from '@ant-design/pro-table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import React, { useMemo, useRef } from 'react';
import { Divider, Popconfirm, Select } from 'antd';
import hooks from './hooks';
import { ShipKeyMap, listShip } from '@/services/shipService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { IShip, IShipBusinessAreaType, IShipMaterialType, IShipType } from '@/interfaces/IShip';
import { SearchConfig } from '@ant-design/pro-table/lib/Form';
import useCreation from '@/hooks/useCreation';

interface IUseShipTableDeps {
  shipType: IShipType[];
  shipMaterialType: IShipMaterialType[];
  shipBusinessAreaType: IShipBusinessAreaType[];
}

interface IUseShipTableExport {
  columns: ProColumns<IShip>[];
  request: any;
  search: SearchConfig;
  actionRef: React.MutableRefObject<ProCoreActionType | undefined>;
}

export default function useShipTable(options: IUseShipTableDeps): IUseShipTableExport {
  const actionRef = useRef<ProCoreActionType>();

  const searchConfig = useCreation<SearchConfig>(() => {
    return {
      span: 6,
      defaultCollapsed: false,
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ShipKeyMap.name,
        dataIndex: 'name',
        search: {
          transform: (val) => {
            return {
              'name.contains': val,
            };
          },
        },
      },
      {
        title: ShipKeyMap.carrierIdentifier,
        dataIndex: 'carrierIdentifier',
        search: {
          transform: (val) => {
            return {
              'carrierIdentifier.contains': val,
            };
          },
        },
      },
      {
        title: ShipKeyMap.shipTypeName,
        dataIndex: 'shipTypeName',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'shipType.equals': val,
            };
          },
        },
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onSelect={props.onSelect}>
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
        search: false,
      },
      {
        title: ShipKeyMap.grossTone,
        dataIndex: 'grossTone',
        search: false,
        render: (val: number) => `${val} 吨`,
      },
      {
        title: '操作',
        render: (text: any, record: IShip) => (
          <>
            <a onClick={() => hooks.InfoShip.call(record)}>详情</a>
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
    let { current = 0, pageSize = 20, ...extra } = params;

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
    search: searchConfig,
    actionRef: actionRef,
  };
}
