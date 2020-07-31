import { useState, useCallback, useEffect } from 'react';
import { IShipMachine } from '@/interfaces/IShip';
import { useToggle, useRequest } from '@umijs/hooks';
import hooks from '@/pages/ship/profile/hooks';
import { deleteShipMachine } from '@/services/shipService';
import { message } from 'antd';

interface IUseMachineFormDeps {
  refreshShipInfo: Function;
}

interface IUseMachineFormExport {
  editMachine?: Partial<IShipMachine>;
  editMachineVisible: boolean;
  onCloseEditMachine(e: any): void;
  onShowEditMachine(machine: Partial<IShipMachine>): void;
}

export default function useMachineForm(option: IUseMachineFormDeps): IUseMachineFormExport {
  const [editMachine, setEditMachine] = useState<Partial<IShipMachine>>();
  const { setLeft, setRight, state } = useToggle(false);

  const { run } = useRequest(deleteShipMachine, {
    manual: true,
    onSuccess() {
      message.success('船机信息已删除');
      option.refreshShipInfo();
    },
    onError() {
      message.error('船机信息更新失败');
    },
  });

  useEffect(() => {
    const unTapEditMachine = hooks.EditShipMachine.tap(machine => {
      setEditMachine(machine);
      setRight();
    });

    const unTapDeleteMachine = hooks.DeleteShipMachine.tap(machine => {
      run(machine.id);
    });

    return () => {
      unTapEditMachine();
      unTapDeleteMachine();
    };
  }, []);

  const onClose = useCallback(() => {
    setEditMachine(undefined);
    setLeft();
  }, []);

  const onShow = useCallback((machine: Partial<IShipMachine>) => {
    setEditMachine(machine);
    setRight();
  }, []);

  return {
    editMachine,
    editMachineVisible: state,
    onCloseEditMachine: onClose,
    onShowEditMachine: onShow,
  };
}
