import { ProColumns } from '@ant-design/pro-table';
import { IManager, IManagerDutyType, IManagerPositionType } from '@/interfaces/IManager';
import React, { useMemo } from 'react';
import { Divider, Popconfirm, Select } from 'antd';
import hooks from './hooks';
import { ManagerKeyMap, listManager } from '@/services/managerService';
import { IPageableFilter } from '@/interfaces/ITableList';

interface IUseManagerTableDeps {
  positionTypes?: IManagerPositionType[];
  dutyTypes?: IManagerDutyType[];
}

interface IUseManagerTableExport {
  columns: ProColumns<IManager>[];
  request: Function;
}

export default function useManagerTable(options: IUseManagerTableDeps): IUseManagerTableExport {
  const columns = useMemo(() => {
    return [
      {
        title: ManagerKeyMap.name,
        dataIndex: 'name',
      },
      {
        title: ManagerKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        hideInSearch: true,
      },
      {
        title: ManagerKeyMap.managerPositionName,
        hideInTable: true,
        hideInSearch: false,
        dataIndex: 'managerPositionId',
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onChange={props.onChange}>
              <Select.Option key={99} value={-1}>
                不限类型
              </Select.Option>
              {options.positionTypes?.map((item, index) => {
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
        title: ManagerKeyMap.managerDutyName,
        hideInTable: true,
        hideInSearch: false,
        dataIndex: 'managerDutyId',
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择类型" onChange={props.onChange}>
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
        title: ManagerKeyMap.managerPositionName,
        dataIndex: 'managerPositionName',
        hideInSearch: true,
      },
      {
        title: ManagerKeyMap.managerDutyName,
        dataIndex: 'managerDutyName',
        hideInSearch: true,
      },
      {
        title: ManagerKeyMap.educationLevel,
        dataIndex: 'educationLevel',
        hideInSearch: true,
      },
      {
        title: ManagerKeyMap.mobile,
        dataIndex: 'mobile',
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
    let { current = 0, pageSize = 20 } = params;
    let extra = {};

    if (params.name !== undefined) {
      extra['name.contains'] = params.name;
    }

    if (params.mobile !== undefined) {
      extra['mobile.contains'] = params.mobile;
    }

    if (params.identityNumber !== undefined) {
      extra['identityNumber.contains'] = params.identityNumber;
    }

    if (params.managerDutyId !== undefined && params.managerDutyId != -1) {
      extra['managerDutyId.equals'] = params.managerDutyId;
    }

    if (params.managerPositionId !== undefined && params.managerPositionId != -1) {
      extra['managerPositionId.equals'] = params.managerPositionId;
    }

    const data = await listManager(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  return {
    columns,
    request: requestManagerList,
  };
}
