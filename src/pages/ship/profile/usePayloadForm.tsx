import { useState, useCallback, useEffect } from 'react';
import { IShipPayload } from '@/interfaces/IShip';
import { useRequest } from 'umi';
import useToggle from '@/hooks/useToggle';
import { deleteShipPayload } from '@/services/shipService';
import { message } from 'antd';
import hooks from '@/pages/ship/profile/hooks';

interface IUsePayloadFormDeps {
  refreshShipInfo: Function;
}
interface IUsePayloadFormExport {
  editPayload?: Partial<IShipPayload>;
  editPayloadVisible: boolean;
  onCloseEditPayload(e: any): void;
  onShowEditPayload(payload: Partial<IShipPayload>): void;
}

export default function usePayloadForm(option: IUsePayloadFormDeps): IUsePayloadFormExport {
  const [editPayload, setEditPayload] = useState<Partial<IShipPayload>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  const { run } = useRequest(deleteShipPayload, {
    manual: true,
    onSuccess() {
      message.success('载量信息已删除');
      option.refreshShipInfo();
    },
    onError() {
      message.error('载量信息更新失败');
    },
  });

  useEffect(() => {
    const unTapDeletePayload = hooks.DeleteShipPayload.tap((payload) => {
      run(payload.id);
    });
    return () => {
      unTapDeletePayload();
    };
  }, []);

  const onClose = useCallback(() => {
    setEditPayload(undefined);
    setLeft();
  }, []);

  const onShow = useCallback((payload: Partial<IShipPayload>) => {
    setEditPayload({
      ...payload,
    });
    setRight();
  }, []);

  return {
    editPayload,
    editPayloadVisible: state,
    onCloseEditPayload: onClose,
    onShowEditPayload: onShow,
  };
}
