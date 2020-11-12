import { ProColumns } from '@ant-design/pro-table';
import React, { useMemo, useRef } from 'react';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';
import { SailorKeyMap, listSailor } from '@/services/sailorService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { ISailor, ISailorDutyType } from '@/interfaces/ISailor';
import { ProCoreActionType } from '@ant-design/pro-utils';
import CategorySelect from '@/components/CategorySelect';

interface IUseSailorTableDeps {
  dutyTypes?: ISailorDutyType[];
}

interface IUseSailorTableExport {
  columns: ProColumns<ISailor>[];
  request: any;
  actionRef: React.MutableRefObject<ProCoreActionType | undefined>;
}

export default function useSailorTable(options: IUseSailorTableDeps): IUseSailorTableExport {
  const actionRef = useRef<ProCoreActionType>();

  const columns = useMemo(() => {
    return [
      {
        title: SailorKeyMap.name,
        dataIndex: 'name',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'name.contains': val,
            };
          },
        },
      },
      {
        title: SailorKeyMap.gender,
        dataIndex: 'gender',
        search: false,
        valueEnum: {
          0: '男',
          1: '女',
          2: '不限',
        },
      },
      {
        title: SailorKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'identityNumber.contains': val,
            };
          },
        },
      },
      {
        title: SailorKeyMap.sailorDutyTypeName,
        dataIndex: 'sailorDutyTypeName',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'sailorDutyType.equals': val,
            };
          },
        },
        renderFormItem: (item, props) => {
          return <CategorySelect placeholder="请选择类型" category="SailorDutyType" onSelect={props.onSelect} />;
        },
      },
      {
        title: SailorKeyMap.licenseNumber,
        dataIndex: 'licenseNumber',
        search: {
          transform: (val) => {
            if (val == -1) return undefined;
            return {
              'licenseNumber.contains': val,
            };
          },
        },
      },
      {
        title: SailorKeyMap.mobile,
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
        title: SailorKeyMap.isAdvanced,
        dataIndex: 'isAdvanced',
        search: {
          transform: (val) => {
            if (!val) return undefined;
            return {
              'isAdvanced.equals': val,
            };
          },
        },
        valueEnum: {
          true: { text: '是', status: 'Success' },
          false: { text: '否', status: 'Error' },
        },
      },
      {
        title: '操作',
        render: (text: any, record: ISailor) => (
          <>
            <a onClick={() => hooks.InfoSailor.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditSailor.call(record)}>更改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" placement={'left'} onConfirm={() => hooks.DeleteSailor.call(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ] as ProColumns<ISailor>[];
  }, [options.dutyTypes]);

  const requestList = async (params: IPageableFilter<ISailor>) => {
    let { current = 0, pageSize = 20, ...extra } = params;

    const data = await listSailor(current, pageSize, extra);

    return {
      success: true,
      total: data.pagination.total,
      data: data.list,
    };
  };

  return {
    columns,
    actionRef,
    request: requestList,
  };
}
