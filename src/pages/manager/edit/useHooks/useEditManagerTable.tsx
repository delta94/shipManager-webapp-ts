import React, { useState, useEffect, useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { IManager, IManagerCert, IManagerCertType } from '@/interfaces/IManager';
import { IssueDepartmentType } from '@/interfaces/IIssueDepartment';
import { ManagerCertKeyMap } from '@/services/managerCertService';
import { Divider, Popconfirm } from 'antd';
import hooks from '../hooks';

interface IUseEditManagerTableDeps {
  manager?: IManager;
  managerCertTypes?: IManagerCertType[];
  issueDepartmentTypes?: IssueDepartmentType[];
  onEditRow(certificate: IManagerCert): void;
}

interface IUseEditManagerTableExport {
  columns: ColumnsType<IManagerCert>;
  data: IManagerCert[];
  onChange(value: IManagerCert): void;
}

export default function useEditManagerTable(options: IUseEditManagerTableDeps): IUseEditManagerTableExport {
  const [data, updateData] = useState<IManagerCert[]>([]);
  const columns = useMemo(() => {
    return [
      {
        title: ManagerCertKeyMap.name,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: ManagerCertKeyMap.managerCertTypeName,
        dataIndex: 'managerCertTypeName',
        key: 'companyCertTypeName',
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
    ] as ColumnsType<IManagerCert>;
  }, []);

  useEffect(() => {
    if (options.manager?.managerCerts && Array.isArray(options.manager.managerCerts)) {
      updateData(options.manager.managerCerts);
    }

    const unTapDeleteManagerCert = hooks.DeleteManagerCert.tap(managerCert => {
      updateData(data => {
        return data.filter(item => item.id == managerCert.id);
      });
    });
    const unTapInfoManagerCert = hooks.InfoManagerCert.tap(managerCert => {

    });
    const unTapEditManagerCert = hooks.EditManagerCert.tap(managerCert => {
      options.onEditRow(managerCert);
    });
    return () => {
      unTapDeleteManagerCert();
      unTapInfoManagerCert();
      unTapEditManagerCert();
    };
  }, []);

  const onChange = (value: IManagerCert) => {
    updateData([...data, value]);
  };

  return {
    data,
    columns,
    onChange,
  };
}
