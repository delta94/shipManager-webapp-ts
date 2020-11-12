import { useState, useCallback, useEffect } from 'react';
import { IManager } from '@/interfaces/IManager';
import useToggle from '@/hooks/useToggle';
import hooks from '@/pages/manager/list/hooks';

interface IUseManagerFormDeps {}

interface IUseMangerFormExport {
  editManger?: Partial<IManager>;
  editMangerVisible: boolean;
  onCloseEditManger(e: any): void;
  onShowEditManger(manager: Partial<IManager>): void;
}

export default function useManagerEditForm(option?: IUseManagerFormDeps): IUseMangerFormExport {
  const [editManger, setEditManger] = useState<Partial<IManager>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    const unTapEditManger = hooks.EditManager.tap((manager) => {
      setEditManger(manager);
      setRight();
    });

    return () => {
      unTapEditManger();
    };
  }, []);

  const onClose = useCallback(() => {
    setEditManger(undefined);
    setLeft();
  }, []);

  const onShow = useCallback((manager: Partial<IManager>) => {
    setEditManger(manager);
    setRight();
  }, []);

  return {
    editManger,
    editMangerVisible: state,
    onCloseEditManger: onClose,
    onShowEditManger: onShow,
  };
}
