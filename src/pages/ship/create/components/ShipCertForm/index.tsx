import React, {useEffect} from 'react';
import {ShipCreateStep} from '@/pages/ship/create/types';
import IShip from '@/interfaces/IShip';

interface ShipCertFormProps {
  ship: Partial<IShip>;
  currentStep: ShipCreateStep;
  switchToStep(index: ShipCreateStep, ship: Partial<IShip>): void;
}

const ShipCertForm: React.FC<ShipCertFormProps> = ({ ship, currentStep, switchToStep }) => {
  useEffect(() => {
    if (ship && currentStep == ShipCreateStep.Certificate) {

    }
  }, [ship, currentStep]);
  return <></>;
};

export default ShipCertForm;
