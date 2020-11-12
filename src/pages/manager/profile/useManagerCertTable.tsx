import React from 'react';
import { ManagerCertKeyMap } from '@/services/managerCertService';
import hooks from './hooks';
import { Divider, Popconfirm } from 'antd';
import useCreation from '@/hooks/useCreation';
import { IManagerCert } from '@/interfaces/IManager';

interface IUseManagerCertTableDeps {}

interface IUseManagerCertTableExport {
  columns: any;
}

export default function useManagerCertTable(option?: IUseManagerCertTableDeps): IUseManagerCertTableExport {
  const columns = useCreation(() => {
    return [
      {
        title: ManagerCertKeyMap.name,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: ManagerCertKeyMap.managerCertTypeName,
        dataIndex: 'managerCertTypeName',
        key: 'managerCertTypeName',
      },
      {
        title: ManagerCertKeyMap.issuedAt,
        dataIndex: 'issuedAt',
        key: 'issuedAt',
      },
      {
        title: ManagerCertKeyMap.expiredAt,
        dataIndex: 'expiredAt',
        key: 'expiredAt',
      },
      {
        title: ManagerCertKeyMap.issueDepartmentTypeName,
        dataIndex: 'issueDepartmentTypeName',
        key: 'issueDepartmentTypeName',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: IManagerCert) => (
          <>
            <a onClick={() => hooks.InfoManagerCert.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditManagerCert.call(record)}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteManagerCert.call(record)}>
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
  };
}
