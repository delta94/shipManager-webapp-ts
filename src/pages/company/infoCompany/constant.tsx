import { CompanyCertKeyMap as CompanyCertKeys } from '@/services/companyCertService';
import { ICompanyCert } from '@/interfaces/ICompany';
import React from 'react';
import { Divider, Popconfirm } from 'antd';
import hooks from '@/pages/company/infoCompany/hooks';

export const tabList = [
  {
    key: 'permission',
    tab: '许可证书',
  },
  {
    key: 'extra',
    tab: ' 其他证书',
  },
];

export const columns = [
  {
    title: CompanyCertKeys.name,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: CompanyCertKeys.companyCertTypeName,
    dataIndex: 'companyCertTypeName',
    key: 'companyCertTypeName',
  },
  {
    title: CompanyCertKeys.issuedAt,
    dataIndex: 'issuedAt',
    key: 'issuedAt',
  },
  {
    title: CompanyCertKeys.expiredAt,
    dataIndex: 'expiredAt',
    key: 'expiredAt',
  },
  {
    title: CompanyCertKeys.issueDepartmentTypeName,
    dataIndex: 'issueDepartmentTypeName',
    key: 'issueDepartmentTypeName',
  },
  {
    title: '操作',
    key: 'action',
    render: (text: any, record: ICompanyCert) => (
      <>
        <a onClick={() => hooks.InfoCompanyCert.call(record)}>详情</a>
        <Divider type="vertical" />
        <a onClick={() => hooks.EditCompanyCert.call(record)}>修改</a>
        <Divider type="vertical" />
        <span>
          <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteCompanyCert.call(record)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      </>
    ),
  },
];
