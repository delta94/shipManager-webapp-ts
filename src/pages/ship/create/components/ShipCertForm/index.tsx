import React from 'react';
import {ShipCreateStep} from "@/pages/ship/create/types";

interface IndexProps {
  currentStep: ShipCreateStep
}

const Index: React.FC<IndexProps> = ({ title }) => {
  return <div>Index</div>;
};

export default Index;
