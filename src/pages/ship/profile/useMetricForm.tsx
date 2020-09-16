import { useState, useEffect } from 'react';
import { IShip } from '@/interfaces/IShip';
import useToggle from '@/hooks/useToggle';
import { parseCM2M, parseKG2T } from '@/utils/parser';

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
  const [state, { setLeft, setRight }] = useToggle(false);

  useEffect(() => {
    if (option.ship) {
      setEditShipMetric({
        ...option.ship,
        ...({
          length: parseCM2M(option.ship.length),
          height: parseCM2M(option.ship.height),
          width: parseCM2M(option.ship.width),
          depth: parseCM2M(option.ship.depth),
          grossTone: parseKG2T(option.ship.grossTone),
          netTone: parseKG2T(option.ship.netTone),
        } as Partial<IShip>),
      });
    }
  }, [option.ship]);

  return {
    editShipMetric,
    editMetricVisible: state,
    onCloseEditMetric: setLeft,
    onShowEditMetric: setRight,
  };
}
