import React, { useMemo, useEffect, useRef } from 'react';
import { SailorKeyMap, unlinkSailor } from '@/services/sailorService';
import hooks from '@/pages/ship/profile/hooks';
import { Badge, Divider, Popconfirm, message } from 'antd';
import { ISailor } from '@/interfaces/ISailor';
import { useRequest, history } from 'umi';
import { ProCoreActionType } from '@ant-design/pro-utils';

interface IUseSailorTableDeps {}

interface IUseSailorTableExport {
  columns: any;
  actionRef: React.MutableRefObject<ProCoreActionType | undefined>;
}

export default function useSailorTable(option?: IUseSailorTableDeps): IUseSailorTableExport {
  const actionRef = useRef<ProCoreActionType>();

  const { run } = useRequest(unlinkSailor, {
    manual: true,
    onSuccess() {
      message.success('船员已取消关联');
      actionRef?.current?.reload();
    },
    onError() {
      message.error('船员更新关联失败');
    },
  });

  useEffect(() => {
    const unTapDeleteSailor = hooks.DeleteSailor.tap((sailor) => {
      run(sailor.id);
    });
    const unTapInfoSailor = hooks.InfoSailor.tap((sailor) => {
      history.push(`/person/sailor/profile/${sailor.id}`);
    });
    return () => {
      unTapDeleteSailor();
      unTapInfoSailor();
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: SailorKeyMap.name,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: SailorKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        key: 'identityNumber',
      },
      {
        title: SailorKeyMap.sailorDutyTypeName,
        dataIndex: 'sailorDutyTypeName',
        key: 'sailorDutyTypeName',
      },
      {
        title: SailorKeyMap.isAdvanced,
        dataIndex: 'isAdvanced',
        render: (val: boolean) => {
          return (
            <>
              <Badge status={val ? 'success' : 'default'} />
              {val ? '是' : '否'}
            </>
          );
        },
      },
      {
        title: SailorKeyMap.mobile,
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: ISailor) => (
          <>
            <a onClick={() => hooks.InfoSailor.call(record)}>详情</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteSailor.call(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];
  }, []);

  return {
    columns,
    actionRef
  };
}
