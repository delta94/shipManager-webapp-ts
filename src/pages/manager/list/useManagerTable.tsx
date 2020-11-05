import { ProColumns, SearchConfig } from '@ant-design/pro-table';
import { IManager, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import React, { useMemo, useRef } from 'react';
import { Divider, Popconfirm, Select } from 'antd';
import hooks from './hooks';
import { ManagerKeyMap, listManager } from '@/services/managerService';
import { IPageableFilter } from '@/interfaces/ITableList';
import useCreation from '@/hooks/useCreation';

interface IUseManagerTableDeps {
  positionTypes?: IManagerPositionType[];
  dutyTypes?: IManagerDutyType[];
}

interface IUseManagerTableExport {
  columns: ProColumns<IManager>[];
  request: Function;
  actionRef: React.RefObject<ActionType>;
  search: SearchConfig;
}

export default function useManagerTable(options: IUseManagerTableDeps): IUseManagerTableExport {
  const actionRef = useRef<ActionType>();

  const searchConfig = useCreation<SearchConfig>(() => {
    return {
      span: 6,
      defaultCollapsed: false,
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ManagerKeyMap.name,
        dataIndex: 'name',
        search: true,
        order: 5,
      },
      {
        title: ManagerKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        search: true,
        order: 4,
      },
      {
        title: ManagerKeyMap.gender,
        dataIndex: 'gender',
        search: {
          transform: (val) => {
            if (val == 2) return {};
            return {
              'gender.equals': parseInt(val),
            };
          },
        },

        valueEnum: {
          0: '男',
          1: '女',
          2: '不限',
        },
      },

      {
        title: ManagerKeyMap.managerDutyName,
        hideInTable: true,
        search: false,
        dataIndex: 'managerDutyId',
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onSelect={props.onSelect}>
              <Select.Option key={99} value={-1}>
                不限类型
              </Select.Option>
              {options.dutyTypes?.map((item, index) => {
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
        title: ManagerKeyMap.educationLevel,
        dataIndex: 'educationLevel',
        search: true,
      },
      {
        title: ManagerKeyMap.mobile,
        dataIndex: 'mobile',
        search: true,
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
    actionRef,
    request: requestManagerList,
  };
}
