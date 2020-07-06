import { CompanyCertKeyMap as CompanyCertKeys } from '@/services/companyCertService';

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
];
