import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IShip, IShipLicense } from '@/interfaces/IShip';
import { NavigationProps } from '@/hooks/useStep';
import { Modal, Table, Card, Typography, Button, Divider, Popconfirm, Space } from 'antd';
import EditLicenseForm from '@/pages/ship/edit/editLicenseForm';
import useToggle from '@/hooks/useToggle';
import hooks from '@/pages/ship/profile/hooks';
import { ICategory, ICommonOptionType } from '@/interfaces/ICategory';
import { PlusOutlined } from '@ant-design/icons';
import { ShipLicenseKeyMap } from '@/services/shipService';

interface ShipLicenseFormProps {
  ship: Partial<IShip>;
  navigation: NavigationProps;
  shipCategoryType?: Record<ICategory, ICommonOptionType[]>;
  onUpdate(ship: Partial<IShip>, save?: boolean): void;
}

const ShipLicenseForm: React.FC<ShipLicenseFormProps> = ({ ship, shipCategoryType, onUpdate, navigation }) => {
  const [licenses, setLicenses] = useState<IShipLicense[]>([]);
  const [editLicense, setEditLicense] = useState<Partial<IShipLicense>>();
  const { setLeft, setRight, state } = useToggle(false);

  useEffect(() => {
    const unTapDeleteLicense = hooks.DeleteShipLicense.tap(license => {
      setLicenses(licenses => {
        return licenses.filter(item => item.id != license.id);
      });
    });
    const unTapEditShipLicense = hooks.EditShipLicense.tap(license => {
      setEditLicense(license);
      setRight();
    });

    if (ship.shipLicenses && ship.shipLicenses.length > 0) {
      setLicenses([...ship.shipLicenses]);
    }

    return () => {
      unTapDeleteLicense();
      unTapEditShipLicense();
    };
  }, []);

  const opLicenseUpdate = useCallback(
    (license: IShipLicense) => {
      if (!license.shipLicenseTypeName && license.shipLicenseTypeId != undefined) {
        // @ts-ignore
        license.shipLicenseTypeName =
          // @ts-ignore
          shipCategoryType?.ShipLicenseType?.find(item => item.id == license.shipLicenseTypeId).name ?? '';
        // @ts-ignore
        license.issueDepartmentTypeName =
          // @ts-ignore
          shipCategoryType?.IssueDepartmentType?.find(item => item.id == license.issueDepartmentTypeId).name ?? '';
      }
      if (license.id) {
        setLicenses(licenses => {
          let idx = licenses.findIndex(item => item.id == license.id);
          if (idx > -1) {
            licenses[idx] = license;
          }
          return [...licenses];
        });
      } else {
        license.id = Date.now();
        setLicenses(licenses => {
          return [...licenses, license];
        });
      }
      setLeft();
    },
    [shipCategoryType],
  );

  const columns = useMemo(() => {
    return [
      {
        title: ShipLicenseKeyMap.identityNumber,
        dataIndex: 'identityNumber',
        key: 'identityNumber',
      },
      {
        title: ShipLicenseKeyMap.businessField,
        dataIndex: 'businessField',
        key: 'businessField',
      },
      {
        title: ShipLicenseKeyMap.expiredAt,
        dataIndex: 'expiredAt',
        key: 'expiredAt',
      },
      {
        title: ShipLicenseKeyMap.issuedAt,
        dataIndex: 'issuedAt',
        key: 'issuedAt',
      },
      {
        title: ShipLicenseKeyMap.issueDepartmentTypeName,
        dataIndex: 'issueDepartmentTypeName',
        key: 'issueDepartmentTypeName',
      },
      {
        title: ShipLicenseKeyMap.shipLicenseTypeName,
        dataIndex: 'shipLicenseTypeName',
        key: 'shipLicenseTypeName',
      },
      {
        title: ShipLicenseKeyMap.remark,
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: IShipLicense) => (
          <>
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

  return (
    <div>
      <Card bordered={false}>
        <Table
          key="id"
          pagination={false}
          dataSource={licenses}
          columns={columns}
          locale={{
            emptyText: '无营运证信息数据',
          }}
          title={() => <Typography.Title level={4}>营运证信息信息</Typography.Title>}
        />
        <Button
          type={'dashed'}
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => {
            setEditLicense({});
            setRight();
          }}
        >
          <PlusOutlined />
          添加营运证信息
        </Button>
      </Card>

      <Card bordered={false}>
        <Space style={{ float: 'right' }}>
          <Button
            onClick={() => {
              onUpdate({ shipLicenses: [...licenses] }, false);
              navigation.previous();
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onUpdate({ shipLicenses: [...licenses] }, true);
              navigation.next();
            }}
          >
            下一步
          </Button>
        </Space>
      </Card>

      <Modal
        maskClosable={false}
        width={720}
        visible={state}
        title="编辑营运证信息信息"
        destroyOnClose={true}
        footer={null}
        onCancel={setLeft}
      >
        <EditLicenseForm
          issueDepartmentType={shipCategoryType?.IssueDepartmentType ?? []}
          shipLicenseType={shipCategoryType?.ShipLicenseType ?? []}
          runSave={false}
          license={editLicense}
          onUpdate={opLicenseUpdate}
          onCancel={setLeft}
        />
      </Modal>
    </div>
  );
};

export default ShipLicenseForm;
