import { ProColumns, ActionType } from '@ant-design/pro-table';
import { IManager, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import React, { useMemo, useRef } from 'react';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';
import { ManagerKeyMap, listManager } from '@/services/managerService';
import { IPageableFilter } from '@/interfaces/ITableList';
import useCreation from '@/hooks/useCreation';
import { SearchConfig } from '@ant-design/pro-table/lib/Form';
import CategorySelect from '@/components/CategorySelect';

interface IUseManagerTableDeps {
  positionTypes?: IManagerPositionType[];
  dutyTypes?: IManagerDutyType[];
}

interface IUseManagerTableExport {
  columns: ProColumns<IManager>[];
  request: Function;
  actionRef: React.RefObject<ActionType | undefined>;
  search: SearchConfig;
}

export default function useManagerTable(options: IUseManagerTableDeps): IUseManagerTableExport {
  const actionRef = useRef<ActionType>();

  const searchConfig = useCreation<SearchConfig>(() => {
    return {
      span: 8,
      defaultCollapsed: true,
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ManagerKeyMap.name,
        dataIndex: 'name',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'name.contains': val,
            };
          },
        },
        order: 5,
      },
      {
        title: ManagerKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'identityNumber.contains': val,
            };
          },
        },
        order: 4,
      },
      {
        title: ManagerKeyMap.gender,
        dataIndex: 'gender',
        search: false,
        valueEnum: {
          0: '男',
          1: '女',
          2: '不限',
        },
      },
      {
        title: ManagerKeyMap.managerDutyName,
        dataIndex: 'managerDutyName',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'managerDuty.equals': val,
            };
          },
        },
        renderFormItem: (item, props) => {
          return <CategorySelect placeholder="请选择类型" category="ManagerDutyType" onSelect={props.onSelect} />;
        },
      },
      {
        title: ManagerKeyMap.managerPositionName,
        dataIndex: 'managerPositionName',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'managerPosition.equals': val,
            };
          },
        },
        renderFormItem: (item, props) => {
          return <CategorySelect placeholder="请选择类型" category="ManagerPositionType" onSelect={props.onSelect} />;
        },
      },
      {
        title: ManagerKeyMap.educationLevel,
        dataIndex: 'educationLevel',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'educationLevel.contains': val,
            };
          },
        },
      },
      {
        title: ManagerKeyMap.mobile,
        dataIndex: 'mobile',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'mobile.contains': val,
            };
          },
        },
      },
      {
        title: '操作',
        render: (text: any, record: IManager) => (
          <>
            <a onClick={() => hooks.InfoManager.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditManager.call(record)}>更改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm
                title="是否要删除此行？"
                placement={'left'}
                onConfirm={() => hooks.DeleteManager.call(record)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ] as ProColumns<IManager>[];
  }, [options.positionTypes, options.dutyTypes]);

  const requestManagerList = async (params: IPageableFilter<IManager>) => {
    let { current = 0, pageSize = 20, ...extra } = params;

    const data = await listManager(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  return {
    columns,
    search: searchConfig,
    actionRef: actionRef,
    request: requestManagerList,
  };
}
