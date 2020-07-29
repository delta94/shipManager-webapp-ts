import React, { useEffect, useMemo, useState } from 'react';
import { ShipLicenseKeyMap } from '@/services/shipService';
import { IShipLicense } from '@/interfaces/IShip';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';

interface IUseLicenseTableDeps {
  licenses: IShipLicense[];
}

interface IUseLicenseTableExport {
  tabList: any[];
  columns: any[];
  licenses?: IShipLicense[];
  tab: string;
  updateTab: (key: string) => void;
}

export default function useLicenseTable(option: IUseLicenseTableDeps): IUseLicenseTableExport {
  const [tab, updateTab] = useState<string>('inner');
  const [licenses, updateLicenses] = useState<IShipLicense[]>();

  useEffect(() => {
    if (tab == 'inner') {
      let result = option.licenses.filter(item => item.shipLicenseTypeId == 1012001);
      updateLicenses(result);
    } else {
      let result = option.licenses.filter(item => item.shipLicenseTypeId != 1012001);
      updateLicenses(result);
    }
  }, [option.licenses, tab]);

  const tabList = useMemo(() => {
    return [
      {
        key: 'inner',
        tab: '内河营运证',
      },
      {
        key: 'outer',
        tab: '沿海营运证',
      },
    ];
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: ShipLicenseKeyMap.name,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: ShipLicenseKeyMap.businessField,
        dataIndex: 'businessField',
        key: 'businessField',
      },
      {
        title: ShipLicenseKeyMap.shipLicenseTypeName,
        dataIndex: 'shipLicenseTypeName',
        key: 'shipLicenseTypeName',
      },
      {
        title: ShipLicenseKeyMap.issuedAt,
        dataIndex: 'issuedAt',
        key: 'issuedAt',
      },
      {
        title: ShipLicenseKeyMap.expiredAt,
        dataIndex: 'expiredAt',
        key: 'expiredAt',
      },
      {
        title: ShipLicenseKeyMap.issueDepartmentTypeName,
        dataIndex: 'issueDepartmentTypeName',
        key: 'issueDepartmentTypeName',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: IShipLicense) => (
          <>
            <a onClick={() => hooks.InfoShipLicenseCert.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditShipLicenseCert.call(record)}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteShipLicenseCert.call(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];
  }, []);

  return {
    tabList,
    columns,
    tab,
    updateTab,
    licenses,
  };
}
