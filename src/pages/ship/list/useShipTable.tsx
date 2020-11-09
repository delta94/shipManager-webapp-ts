import { ProColumns } from '@ant-design/pro-table';
import { ProCoreActionType } from '@ant-design/pro-utils';
import React, { useRef, useMemo } from 'react';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';
import { ShipKeyMap, listShip } from '@/services/shipService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { IShip } from '@/interfaces/IShip';
import { SearchConfig } from '@ant-design/pro-table/lib/Form';
import useCreation from '@/hooks/useCreation';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';
import CategorySelect from '@/components/CategorySelect';

interface IUseShipTableDeps {
  shipCategoryType?: Record<ICategory, ICommonOptionType[]>;
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
          return <CategorySelect placeholder="请选择类型" category="ShipType" onSelect={props.onSelect} />;
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
  }, [options.shipCategoryType]);

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
