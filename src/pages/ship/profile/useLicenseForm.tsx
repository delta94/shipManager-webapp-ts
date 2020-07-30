import { useState, useCallback, useEffect } from 'react';
import { IShipLicense } from '@/interfaces/IShip';
import { useToggle, useRequest } from '@umijs/hooks';
import hooks from '@/pages/ship/profile/hooks';
import { deleteShipLicense } from '@/services/shipService';
import { message } from 'antd';

interface IUseLicenseFormDeps {
  refreshShipInfo: Function;
}

interface IUseLicenseFormExport {
  editLicense?: Partial<IShipLicense>;
  editLicenseVisible: boolean;
  onCloseEditLicense(e: any): void;
  onShowEditLicense(license: Partial<IShipLicense>): void;
}

export default function useLicenseForm(option: IUseLicenseFormDeps): IUseLicenseFormExport {
  const [editLicense, setEditLicense] = useState<Partial<IShipLicense>>();
  const { setLeft, setRight, state } = useToggle(false);

  const { run } = useRequest(deleteShipLicense, {
    manual: true,
    onSuccess() {
      message.success('营运证信息已删除');
      option.refreshShipInfo();
    },
    onError() {
      message.error('营运证信息更新失败');
    },
  });

  useEffect(() => {
    const unTapEditLicense = hooks.EditShipLicense.tap(license => {
      setEditLicense(license);
      setRight();
    });

    const unTapDeleteLicense = hooks.DeleteShipLicense.tap(license => {
      run(license.id);
    });

    return () => {
      unTapEditLicense();
      unTapDeleteLicense();
    };
  }, []);

  const onClose = useCallback(() => {
    setEditLicense(undefined);
    setLeft();
  }, []);

  const onShow = useCallback((license: Partial<IShipLicense>) => {
    setEditLicense(license);
    setRight();
  }, []);

  return {
    editLicense,
    editLicenseVisible: state,
    onCloseEditLicense: onClose,
    onShowEditLicense: onShow,
  };
}
