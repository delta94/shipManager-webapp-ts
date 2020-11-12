import { useState, useCallback, useEffect } from 'react';
import { IManagerCert } from '@/interfaces/IManager';
import useToggle from '@/hooks/useToggle';
import hooks from "@/pages/manager/edit/hooks";

interface IUseManagerFormDeps {}

interface IUseMangerFormExport {
  editMangerCert?: Partial<IManagerCert>;
  editMangerCertVisible: boolean;
  onCloseEditMangerCert(e: any): void;
  onShowEditMangerCert(managerCert: Partial<IManagerCert>): void;
}

export default function useMangerCertEditForm(option?: IUseManagerFormDeps): IUseMangerFormExport {
  const [editMangerCert, setEditMangerCert] = useState<Partial<IManagerCert>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    const unTapEditMangerCert = hooks.EditManagerCert.tap((managerCert) => {
      setEditMangerCert(managerCert);
      setRight();
    });

    return () => {
      unTapEditMangerCert();
    };
  }, []);

  const onClose = useCallback(() => {
    setEditMangerCert(undefined);
    setLeft();
  }, []);

  const onShow = useCallback((managerCert: Partial<IManagerCert>) => {
    setEditMangerCert(managerCert);
    setRight();
  }, []);

  return {
    editMangerCert,
    editMangerCertVisible: state,
    onCloseEditMangerCert: onClose,
    onShowEditMangerCert: onShow,
  };
}
