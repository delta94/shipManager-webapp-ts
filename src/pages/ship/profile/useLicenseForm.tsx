import { useState, useCallback, useEffect } from 'react';
import { IShipLicense } from '@/interfaces/IShip';
import { useRequest, useHistory } from 'umi';
import useToggle from '@/hooks/useToggle';
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
  const [state, { setLeft, setRight }] = useToggle(false);
  const history = useHistory();

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
    const unTapInfoLicense = hooks.InfoShipLicense.tap((license) => {
      onInfoLicense(license.id)
    });

    const unTapEditLicense = hooks.EditShipLicense.tap((license) => {
      setEditLicense(license);
      setRight();
    });

    const unTapDeleteLicense = hooks.DeleteShipLicense.tap((license) => {
      run(license.id);
    });

    return () => {
      unTapInfoLicense();
      unTapEditLicense();
      unTapDeleteLicense();
    };
  }, []);

  const onInfoLicense = useCallback((id: number) => {
    history.push(`/ship/license/${id}`);
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
