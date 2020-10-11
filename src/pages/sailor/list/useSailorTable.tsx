import { ProColumns } from '@ant-design/pro-table';
import React, { useMemo } from 'react';
import { Divider, Popconfirm, Select, Badge } from 'antd';
import hooks from './hooks';
import { SailorKeyMap, listSailor } from '@/services/sailorService';
import { IPageableFilter } from '@/interfaces/ITableList';
import { ISailor, ISailorDutyType } from '@/interfaces/ISailor';

interface IUseSailorTableDeps {
  dutyTypes?: ISailorDutyType[];
}

interface IUseSailorTableExport {
  columns: ProColumns<ISailor>[];
  request: Function;
}

export default function useSailorTable(options: IUseSailorTableDeps): IUseSailorTableExport {
  const columns = useMemo(() => {
    return [
      {
        title: SailorKeyMap.name,
        dataIndex: 'name',
      },
      {
        title: SailorKeyMap.gender,
        dataIndex: 'gender',
        hideInSearch: true,
        render(value) {
          return value == 0 ? '男' : '女'
        }
      },
      {
        title: SailorKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        hideInSearch: true,
      },
      {
        title: SailorKeyMap.sailorDutyTypeName,
        hideInTable: true,
        hideInSearch: false,
        dataIndex: 'sailorDutyTypeId',
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
        title: SailorKeyMap.sailorDutyTypeName,
        dataIndex: 'sailorDutyTypeName',
        hideInSearch: true,
      },
      {
        title: SailorKeyMap.licenseNumber,
        dataIndex: 'licenseNumber',
        hideInSearch: false,
      },
      {
        title: SailorKeyMap.mobile,
        dataIndex: 'mobile',
      },
      {
        title: SailorKeyMap.isAdvanced,
        dataIndex: 'isAdvanced',
        render: (val) => {
          return (
            <>
              <Badge status={val ? 'success' : 'default'} />
              {val ? '是' : '否'}
            </>
          );
        },
        renderFormItem: (item, props) => {
          return (
            <Select placeholder="请选择" onSelect={props.onSelect}>
              <Select.Option value={-1} key={99}>
                不限
              </Select.Option>
              <Select.Option value="false" key={0}>
                否
              </Select.Option>
              <Select.Option value="true" key={1}>
                是
              </Select.Option>
            </Select>
          );
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
    //@ts-ignore
    if (params.isAdvanced !== undefined && params.isAdvanced != -1) {
      //@ts-ignore
      extra['isAdvanced.equals'] = params.isAdvanced == 'true';
    }

    if (params.licenseNumber !== undefined) {
      extra['licenseNumber.contains'] = params.licenseNumber;
    }

    if (params.sailorDutyTypeId !== undefined && params.sailorDutyTypeId != -1) {
      extra['sailorDutyTypeId.equals'] = params.sailorDutyTypeId;
    }

    const data = await listSailor(current, pageSize, extra);

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
