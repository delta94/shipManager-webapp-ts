import { useState, useEffect } from 'react';
import { IShip } from '@/interfaces/IShip';
import useToggle from '@/hooks/useToggle';

interface IUseBasicFormDeps {
  ship?: IShip;
}

interface IUseBasicFormExport {
  editShipBasic?: Partial<IShip>;
  editBasicVisible: boolean;
  onCloseEditBasic(e: any): void;
  onShowEditBasic(e: any): void;
}

export default function useBasicForm(option: IUseBasicFormDeps): IUseBasicFormExport {
  const [editShipBasic, setEditShipBasic] = useState<Partial<IShip>>();
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    if (option.ship) {
      setEditShipBasic({ ...option.ship });
    }
  }, [option.ship]);

  return {
    editShipBasic,
    editBasicVisible: state,
    onCloseEditBasic: setLeft,
    onShowEditBasic: setRight,
  };
}
