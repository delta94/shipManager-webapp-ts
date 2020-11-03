import React, { useEffect, useMemo, useState } from 'react';
import { ShipLicenseKeyMap } from '@/services/shipService';
import { IShipLicense } from '@/interfaces/IShip';
import { Divider, Popconfirm } from 'antd';
import hooks from './hooks';

interface IUseLicenseTableDeps {
  licenses: IShipLicense[] | undefined;
}

interface IUseLicenseTableExport {
  tabList: any[];
  columns: any[];
  licenses: IShipLicense[] | undefined;
  tab: string;
  updateTab: (key: string) => void;
}

export default function useLicenseTable(option: IUseLicenseTableDeps): IUseLicenseTableExport {
  const [tab, updateTab] = useState<string>('inner');
  const [licenses, updateLicenses] = useState<IShipLicense[]>();

  useEffect(() => {
    if (!Array.isArray(option.licenses)) return;
    if (tab == 'inner') {
      let result = option.licenses.filter((item) => item.shipLicenseTypeId == 1);
      updateLicenses(result);
    } else {
      let result = option.licenses.filter((item) => item.shipLicenseTypeId == 2);
      updateLicenses(result);
    }
  }, [tab, option.licenses]);

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
            <a onClick={() => hooks.InfoShipLicense.call(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => hooks.EditShipLicense.call(record)}>修改</a>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => hooks.DeleteShipLicense.call(record)}>
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
