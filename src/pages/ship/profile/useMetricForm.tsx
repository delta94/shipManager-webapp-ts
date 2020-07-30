import { useState, useEffect } from 'react';
import { IShip } from '@/interfaces/IShip';
import { useToggle } from '@umijs/hooks';

interface IUseMetricFormDeps {
  ship?: IShip;
}

interface IUseMetricFormExport {
  editShipMetric?: Partial<IShip>;
  editMetricVisible: boolean;
  onCloseEditMetric(e: any): void;
  onShowEditMetric(e: any): void;
}

export default function useMetricForm(option: IUseMetricFormDeps): IUseMetricFormExport {
  const [editShipMetric, setEditShipMetric] = useState<Partial<IShip>>();
  const { setLeft, setRight, state } = useToggle(false);

  useEffect(() => {
    if (option.ship) {
      setEditShipMetric({ ...option.ship });
    }
  }, [option.ship]);

  return {
    editShipMetric,
    editMetricVisible: state,
    onCloseEditMetric: setLeft,
    onShowEditMetric: setRight,
  };
}
